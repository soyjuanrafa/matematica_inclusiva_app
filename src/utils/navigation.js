import { CommonActions } from '@react-navigation/native';

export const resetToHome = (navigation) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  );
};

export const navigateToLesson = (navigation, lessonId) => {
  navigation.navigate('Lesson', { lessonId });
};

export const navigateToCompletion = (navigation, score) => {
  navigation.navigate('LessonCompletion', { score });
};

export const goBack = (navigation) => {
  navigation.canGoBack() ? navigation.goBack() : resetToHome(navigation);
};