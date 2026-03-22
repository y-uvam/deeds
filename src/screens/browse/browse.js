import { StyleSheet, Text, View } from "react-native"
import { CustomSkeleton } from "../../components"
import { colors } from "../../utils"

export const Browse=()=>{
    return(
       <View style={style.container}>
        <Text>Browse</Text>
         <CustomSkeleton variant="text"/>
       </View>
    )
}
const style= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
            backgroundColor:colors.black
        
    }
})