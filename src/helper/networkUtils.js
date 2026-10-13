import NetInfo from '@react-native-community/netinfo';

export default networkUtils = async () => {
  const response = await NetInfo.fetch();
  return response.isConnected;
};
