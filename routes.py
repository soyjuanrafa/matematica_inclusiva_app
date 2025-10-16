from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Problem, Progress
from utils import generate_problem, get_adaptive_difficulty, calculate_success_rate
from werkzeug.exceptions import BadRequest
import time

api = Blueprint('api', __name__)

# Authentication routes
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        raise BadRequest('Missing required fields')

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('username', 'password')):
        raise BadRequest('Missing required fields')

    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200

# User routes
@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'level' in data:
        user.level = data['level']
    db.session.commit()

    return jsonify(user.to_dict()), 200

# Problem routes
@api.route('/problems/generate', methods=['POST'])
@jwt_required()
def generate_new_problem():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    operation = data.get('operation', 'addition')
    difficulty = data.get('difficulty', user.level)

    problem = generate_problem(operation, difficulty)
    db.session.add(problem)
    db.session.commit()

    return jsonify(problem.to_dict()), 201

@api.route('/problems/<int:problem_id>', methods=['GET'])
@jwt_required()
def get_problem(problem_id):
    problem = Problem.query.get_or_404(problem_id)
    return jsonify(problem.to_dict()), 200

# Progress routes
@api.route('/progress', methods=['POST'])
@jwt_required()
def submit_answer():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not all(k in data for k in ('problem_id', 'user_answer')):
        raise BadRequest('Missing required fields')

    problem = Problem.query.get_or_404(data['problem_id'])
    is_correct = abs(float(data['user_answer']) - problem.answer) < 0.01  # Allow small floating point errors

    progress = Progress(
        user_id=user_id,
        problem_id=data['problem_id'],
        user_answer=data['user_answer'],
        is_correct=is_correct,
        time_taken=data.get('time_taken')
    )
    db.session.add(progress)
    db.session.commit()

    # Update user level based on performance
    success_rate = calculate_success_rate(user_id)
    new_level = get_adaptive_difficulty(User.query.get(user_id).level, success_rate)
    if new_level != User.query.get(user_id).level:
        User.query.get(user_id).level = new_level
        db.session.commit()

    return jsonify({
        'is_correct': is_correct,
        'correct_answer': problem.answer,
        'new_level': new_level
    }), 200

@api.route('/progress/user', methods=['GET'])
@jwt_required()
def get_user_progress():
    user_id = get_jwt_identity()
    progress = Progress.query.filter_by(user_id=user_id).order_by(Progress.attempted_at.desc()).limit(50).all()
    return jsonify([p.to_dict() for p in progress]), 200

@api.route('/progress/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = get_jwt_identity()
    total_attempts = Progress.query.filter_by(user_id=user_id).count()
    correct_attempts = Progress.query.filter_by(user_id=user_id, is_correct=True).count()
    success_rate = correct_attempts / total_attempts if total_attempts > 0 else 0

    user = User.query.get(user_id)

    return jsonify({
        'total_attempts': total_attempts,
        'correct_attempts': correct_attempts,
        'success_rate': success_rate,
        'current_level': user.level
    }), 200
