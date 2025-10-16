import random
import operator
from models import Problem

operations = {
    'addition': operator.add,
    'subtraction': operator.sub,
    'multiplication': operator.mul,
    'division': operator.truediv
}

difficulty_ranges = {
    'easy': {'min': 1, 'max': 10},
    'medium': {'min': 10, 'max': 50},
    'hard': {'min': 50, 'max': 100}
}

def generate_problem(operation, difficulty):
    """
    Generate a math problem based on operation and difficulty level.
    """
    if operation not in operations:
        raise ValueError("Invalid operation")
    if difficulty not in difficulty_ranges:
        raise ValueError("Invalid difficulty")

    op_func = operations[operation]
    num_range = difficulty_ranges[difficulty]

    num1 = random.randint(num_range['min'], num_range['max'])
    num2 = random.randint(num_range['min'], num_range['max'])

    # Ensure positive results for subtraction and valid division
    if operation == 'subtraction':
        num1, num2 = max(num1, num2), min(num1, num2)
    elif operation == 'division':
        # Ensure integer division for simplicity
        answer = num1 / num2
        if not answer.is_integer():
            num2 = random.randint(1, num_range['max'])
            while num1 % num2 != 0:
                num2 = random.randint(1, num_range['max'])
        answer = num1 / num2

    answer = op_func(num1, num2)

    problem = Problem(
        operation=operation,
        difficulty=difficulty,
        num1=num1,
        num2=num2,
        answer=answer
    )

    return problem

def get_adaptive_difficulty(user_level, success_rate):
    """
    Determine the next difficulty level based on user's current level and success rate.
    """
    if success_rate >= 0.8:
        if user_level == 'beginner':
            return 'medium'
        elif user_level == 'intermediate':
            return 'hard'
        else:
            return 'hard'
    elif success_rate < 0.5:
        if user_level == 'hard':
            return 'medium'
        elif user_level == 'intermediate':
            return 'easy'
        else:
            return 'easy'
    else:
        return user_level

def calculate_success_rate(user_id, recent_attempts=10):
    """
    Calculate the success rate of the user based on recent attempts.
    """
    from models import Progress
    recent_progress = Progress.query.filter_by(user_id=user_id).order_by(Progress.attempted_at.desc()).limit(recent_attempts).all()
    if not recent_progress:
        return 0.0
    correct = sum(1 for p in recent_progress if p.is_correct)
    return correct / len(recent_progress)
