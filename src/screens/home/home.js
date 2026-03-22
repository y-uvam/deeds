import { FlatList, StyleSheet, Text, View } from "react-native"
import { AppBackground, CustomSkeleton, Header } from "../../components"
import { scales } from "../../utils"
import { useEffect, useState } from "react"
import FooterComponent from "../../components/footerComponent/foterComponent"

export const Home=()=>{
    const [loading,setLoading]=useState(true)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])
    return(
        <AppBackground>
            <Header label="Home" showBackButton={true} />
            <FlatList
            data={[1,2,3,4,5]}
             renderItem={({item})=>(
                <CustomSkeleton variant="card" />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding:scales(10),gap:scales(10)}}
            ListFooterComponent={<FooterComponent height={scales(100)} />}
            />
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