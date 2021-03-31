import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import RouteNames from '../constants/RouteNames';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../components/lnb/DrawerContent';
import MyPageScreen from '../screens/home/MyPageScreen';
import HomeScreen from '../screens/home/HomeScreen';
import NotiScreen from '../screens/home/NotiScreen';
import SettingScreen from '../screens/home/SettingScreen';
import SettingCalendarScreen from '../screens/home/SettingCalendar';
import ServiceCenterScreen from "../screens/home/ServiceCenterScreen";
import FAQScreen from "../screens/home/FAQScreen";
import HeaderBackButton from "../components/common/HeaderBackButton";
import TermOfUseScreen from "../screens/home/TermOfUseScreen";
import PersonalInfoScreen from "../screens/home/PersonalInfoScreen";
import AgreeTermScreen from "../screens/home/AgreeTermScreen";
import SignUpScreen from "../screens/home/SignUpScreen";
import MySchedule from "../screens/schedule/MySchedule";
import PersonalInfoAgreeScreen from "../screens/home/PersonalInfoAgreeScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props}/>}
      drawerStyle={{width: '90%'}}>
      <Drawer.Screen name="Drawer" component={Home}>
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const Home = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.Home} component={HomeScreen}/>
      <Stack.Screen options={{headerShown: true}} name={RouteNames.Noti} component={NotiScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.MyPage} component={MyPageScreen}/>
        <Stack.Screen options={headerOption} name={RouteNames.MySchedule} component={MySchedule}/>
      <Stack.Screen options={headerOption} name={RouteNames.Settings} component={SettingScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.SettingCalendar} component={SettingCalendarScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.ServiceCenter} component={ServiceCenterScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.FAQ} component={FAQScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.TermOfUse} component={TermOfUseScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.PersonalInfo} component={PersonalInfoScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.PersonalInfoAgree} component={PersonalInfoAgreeScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.AgreeTerm} component={AgreeTermScreen}/>
      <Stack.Screen options={headerOption} name={RouteNames.SignUp} component={SignUpScreen}/>
    </Stack.Navigator>
  );
};

const headerOption = {
  headerShown: true,
  headerLeft: () => ( <HeaderBackButton/> ),
  headerTitleStyle: { fontWeight: 'bold', color: '#111111' },
  headerStyle: { backgroundColor: '#f7f7f9', shadowColor: 'transparent'},
}

export default HomeNavigator;
