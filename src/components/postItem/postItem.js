import { StyleSheet, Text, View } from "react-native"
import { scales } from "../../utils"
import { ProfileComponent } from "../profileComponent/profileComponent"
import { useSelector } from "react-redux"

export const PostItem =()=>{
    const profileData=useSelector(state=>state.persist.profileData)
    return (
    <View style={styles.container}>
        <ProfileComponent userId={profileData?._id} name={profileData?.name} profileImage={profileData?.profileImage}/>
        <Text>PostItem</Text>
    </View>)
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        borderColor:'red',
        borderWidth:1,
        borderRadius:scales(20),
        padding:scales(10)
    }
})