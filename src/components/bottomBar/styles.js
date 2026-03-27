import { StyleSheet } from 'react-native';
import { colors, scales } from '../../utils';
import { fontFamily } from '../../assets';

const ICON_CONTAINER = scales(50);
const ICON_SIZE = scales(22);

export const styles= StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: scales(200),
    position: 'absolute',
    bottom: scales(30),
    left: scales(20),
    right: scales(20),
    height: scales(70),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scales(30),
    overflow: 'hidden',
  },
  absoluteBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: scales(200),
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scales(6),
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scales(10),
  },

  iconContainer: {
    height: ICON_CONTAINER,
    width: ICON_CONTAINER,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ICON_CONTAINER / 2,
  },

  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    tintColor: colors.white,
  },

  tabItemContainer: {
    height: ICON_CONTAINER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ICON_CONTAINER / 2,
    // borderWidth: 1,
    // borderColor: colors.white,
  },
  
  label: {
    color: colors.white,
    marginLeft: scales(3),
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
  },

  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    height: scales(10),
    width: scales(10),
    borderRadius: scales(5),
    backgroundColor: colors.gray,
  },
});