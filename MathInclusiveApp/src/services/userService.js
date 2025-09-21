// Este archivo simula llamadas a una API para obtener datos del usuario
// En una app real, estas funciones harían peticiones HTTP a un servidor

export const getUserAchievements = async () => {
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Primeros pasos',
          description: 'Completa tu primera lección',
          icon: '🏆',
          earned: true,
          date: '10/05/2023',
        },
        {
          id: 2,
          title: 'Matemático novato',
          description: 'Completa 5 lecciones',
          icon: '🥉',
          earned: true,
          date: '15/05/2023',
        },
        {
          id: 3,
          title: 'Matemático intermedio',
          description: 'Completa 15 lecciones',
          icon: '🥈',
          earned: false,
        },
        {
          id: 4,
          title: 'Matemático experto',
          description: 'Completa 30 lecciones',
          icon: '🥇',
          earned: false,
        },
        {
          id: 5,
          title: 'Perfección',
          description: 'Obtén una puntuación perfecta en una lección',
          icon: '⭐',
          earned: true,
          date: '12/05/2023',
        },
        {
          id: 6,
          title: 'Racha ganadora',
          description: 'Completa lecciones durante 5 días seguidos',
          icon: '🔥',
          earned: false,
        },
      ]);
    }, 1000);
  });
};

export const getUserLevel = async () => {
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        level: 3,
        points: 250,
        nextLevel: 400,
      });
    }, 800);
  });
};

export const getUserStats = async () => {
  // Simulamos una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lessonsCompleted: 12,
        averageAccuracy: 85,
        streak: 5,
      });
    }, 600);
  });
};