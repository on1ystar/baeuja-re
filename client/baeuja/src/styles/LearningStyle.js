import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  useResponsiveHeight,
  useResponsiveWidth,
  useResponsiveScreenHeight,
} from 'react-native-responsive-dimensions'; //반응형 레이아웃 라이브러리

const LearningStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  youtubeContainer: {
    flex: 1,
    height: responsiveScreenHeight(33),
    width: responsiveScreenWidth(100),
  },
  lyricContainer: {
    // backgroundColor: '#000000',
    marginTop: responsiveScreenHeight(10),
    height: responsiveScreenHeight(25),
    width: responsiveScreenWidth(100),
  },
  koreanLyric: {
    fontSize: responsiveFontSize(3.7),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 34,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#555555',
  },
  translatedLyric: {
    fontSize: responsiveFontSize(2.7),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 34,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#555555',
  },
  wordContainer: {
    flex: 1,
  },
  word: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 34,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#555555',
  },
  learningButtonContainer: {
    // backgroundColor: '#000000',
    flex: 1,
    marginTop: responsiveScreenHeight(2),
    width: responsiveScreenWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  learningButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveScreenWidth(17),
    height: 35,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    marginRight: 20,
  },
  voiceEvaluationContainer: {
    flex: 1,
  },
  navigationContainer: {
    flex: 1,
  },
});

export default LearningStyles;
