import { StyleSheet, Text, View } from "react-native"
import { AppBackground, CustomSkeleton, Header } from "../../components"

export const Home=()=>{
    return(
        <AppBackground>
            <Header label="Home" showBackButton={true} />
        <Text style={styles.title}>Home</Text>
        <CustomSkeleton variant="card"/>
       </AppBackground>
    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"black"
    }
})