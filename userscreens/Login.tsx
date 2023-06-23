import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../NavigationView"
import { Text,TextInput, TouchableOpacity, View,StyleSheet, StyleProp, Pressable} from "react-native"
import React, { ReactElement } from "react"
import { NewAccount, createNewAccount, getAccountClientM, getAccountClientP } from "../helpers/DevClient"
import { AuthContext } from "../App"

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>
type InputProps = {textValues:string[],dontchange:boolean,index:number} 
const TextRow = ({textValues,index,dontchange}:InputProps)=>{

    let list:ReactElement[] = [];
    for(let i = index;i<(index+4);i++){
        list.push(<TextInput style={styles.inputbox}
            placeholder=""
            onChangeText={newText => {if(!dontchange){textValues[i] = newText}}}
            defaultValue={textValues[i]}
        ></TextInput>)
    }
    return(
        <View style={styles.textbox}>
            {list}
        </View>
    )
 }

const Login = ({route,navigation}:LoginProps):JSX.Element=>{

    const [loginType,setPageType]= React.useState<boolean>(false);
    const [memonic,setMemonic] = React.useState<string[]>(["","","","","","","","","","","",""]);
    const [accid,setAcc] = React.useState<string>("")
    const [pkey,setPkey] = React.useState<string>("")
    const [created,setCreateFlag ] = React.useState<boolean>(false);
    const {client,setClient} = React.useContext(AuthContext)

    const newUser = ()=>{
        createNewAccount().then((value:NewAccount)=>{
            setMemonic(value.keystring.split(" "));
            setAcc(value.accid);
            setCreateFlag(true);
            setTimeout(()=>{
                
            },40000)
        })
    }
    const oldUser = () =>{
        let wordString = memonic.join(" ")

        getAccountClientM(wordString,accid).then((newclient)=>{
            setClient(newclient);
        })
    }
    return 
    (
        <View style={styles.outerbox}>
            if(created||loginType){
                <View style={styles.upperbox}>
                    <TextRow textValues={memonic} index={0} dontchange={created}></TextRow>
                    <TextRow textValues={memonic} index={4} dontchange={created}></TextRow>
                    <TextRow textValues={memonic} index={8} dontchange={created}></TextRow>
                </View>
            }
            if(created||loginType){
                <View style={styles.middlebox}>
                    <TextInput style={styles.inputbox}
                        placeholder=""
                        onChangeText={newText =>{if(!created) setAcc(accid)}}
                        defaultValue={accid}
                    ></TextInput>
                </View>
            }{created?
                <View style={styles.buttons}>
                <Pressable onPress={()=>{
                        setPageType(false);
                        setCreateFlag(false);
                        
                        getAccountClientP(pkey,accid).then((newclient)=>{
                            setClient(newclient);
                        });

                        setPkey("");
                        setAcc("");
                        setMemonic(["","","","","","","","","","","",""])
                    }}>
                    <Text>{loginType?"Enter keys ":"Create keys"}</Text>
                </Pressable>
                </View>
            
                :<View style={styles.buttons}>
                <Pressable onPress={loginType?oldUser:newUser}>
                    <Text>{loginType?"Enter keys ":"Create keys"}</Text>
                </Pressable>
                <Pressable onPress={()=>setPageType(!loginType)}>
                    <Text>
                        {loginType?"Create new keys ?":"Already have an hedera account"}
                    </Text>
                </Pressable>
                </View>
            }
        </View>
    );
}
export default Login;

const styles = StyleSheet.create({
    outerbox:{
        flexDirection:'row',
        height:'100%',
        width:'100%',
        alignItems:"center",
    },
    upperbox:{
        flex:4
    },
    middlebox:{
        flex:1
    },
    textbox:{
        flex:1,
        flexDirection:'column',
        padding:10,
    },
    inputbox:{
        flex:1,
    },
    buttons:{
        flex:2
    }

})