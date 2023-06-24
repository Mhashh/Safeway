import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../helpers/AuthContext"
import { Text,TextInput, View,StyleSheet, Pressable, NativeSyntheticEvent, TextInputEndEditingEventData, TextInputChangeEventData} from "react-native"
import React from "react"
import { NewAccount, createNewAccount, getAccountClientM, getAccountClientP } from "../helpers/DevClient"
import { AuthContext } from "../helpers/AuthContext"

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>



export default function Login({route,navigation}:LoginProps){

    const [loginType,setPageType]= React.useState<boolean>(true);
    
    const [accid,setAcc] = React.useState<string>("")
    const [pkey,setPkey] = React.useState<string>("")
    const [created,setCreateFlag ] = React.useState<boolean>(false);
    const {setClient,setUserAcc,setAddr} = React.useContext(AuthContext)

    //12 word key string states

    const[a,setA] = React.useState<string>("")
    const[b,setB] = React.useState<string>("")
    const[c,setC] = React.useState<string>("")
    const[d,setD] = React.useState<string>("")
    const[e,setE] = React.useState<string>("")
    const[f,setF] = React.useState<string>("")
    const[g,setG] = React.useState<string>("")
    const[h,setH] = React.useState<string>("")
    const[i,setI] = React.useState<string>("")
    const[j,setJ] = React.useState<string>("")
    const[k,setK] = React.useState<string>("")
    const[l,setL] = React.useState<string>("")

    const newUser = ()=>{
        createNewAccount().then((value:NewAccount)=>{
            const newkey = value.keystring.split(" ")
            setA(newkey[0]);
            setB(newkey[1]);
            setC(newkey[2]);
            setD(newkey[3]);
            setE(newkey[4]);
            setF(newkey[5]);
            setG(newkey[6]);
            setH(newkey[7]);
            setI(newkey[8]);
            setJ(newkey[9]);
            setK(newkey[10]);
            setL(newkey[11]);
            setAcc(value.accid);            
            setUserAcc(accid);
            setPkey(value.privatekey)
            setAddr(value.address)
            setCreateFlag(true);
            console.log(accid+"  ,  "+value.keystring+"  ,  "+pkey)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const oldUser = () =>{
        let wordString = a+" "+b+" "+c+" "+d+" "+e+" "+f+" "+g+" "+h+" "+i+" "+j+" "+k+" "+l
        setUserAcc(accid);
        getAccountClientM(wordString,accid).then(({newclient,address})=>{
            setAddr(address)
            setClient(newclient);
        }).catch((err)=>{
            console.log(err)
        })
    }


    return(
        <View style={styles.outerbox}>
            {(created||loginType)&&<View style={styles.upperbox}><View style={styles.textbox}>
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={a}
                            onChangeText={setA}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={b}
                            onChangeText={setB}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={c}
                            onChangeText={setC}
                        />
                    </View><View style={styles.textbox}>
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={d}
                            onChangeText={setD}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={e}
                            onChangeText={setE}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={f}
                            onChangeText={setF}
                        />
                    </View><View style={styles.textbox}>
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={g}
                            onChangeText={setG}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={h}
                            onChangeText={setH}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={i}
                            onChangeText={setI}
                        />
                    </View><View style={styles.textbox}>
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={j}
                            onChangeText={setJ}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={k}
                            onChangeText={setK}
                        />
                        <TextInput style={styles.inputbox}
                            placeholder="12 word key"
                            value={l}
                            onChangeText={setL}
                        />
                    </View>
                </View>
            }
            {(created||loginType)&&<View style={styles.middlebox}>
                    <TextInput style={styles.inputbox}
                        placeholder="Enter Account id here"
                        onChangeText={newText =>{if(!created) setAcc(newText)}}
                        value={accid}
                    ></TextInput>
                </View>
            }{created?<View style={styles.buttons}>
                    <Pressable onPress={()=>{
                        
                        
                        getAccountClientP(pkey,accid).then((newclient)=>{
                            setClient(newclient);
                        }).catch((err)=>{
                            console.log(err)
                        });
                        setPageType(false);
                        setCreateFlag(false);
                        setPkey("");
                        setAcc("");
                        
                        setA("");
                        setB("");
                        setC("");
                        setD("");
                        setE("");
                        setF("");
                        setG("");
                        setH("");
                        setI("");
                        setJ("");
                        setK("");
                        setL("");
                    }}><Text>{loginType==true?"Enter keys ":"Create keys"}</Text></Pressable></View>
                :<View style={styles.buttons}>
                <Pressable onPress={loginType?oldUser:newUser}><Text style={styles.textbutton}>{loginType ==true?"Enter keys ":"Create keys"}</Text></Pressable>
                <Pressable onPress={()=>setPageType(!loginType)}><Text style={styles.alternatebutton}>{loginType==true?"Create new keys ?":"Already have an hedera account"}</Text></Pressable>
                </View>
            }
        </View>
    );
}

export const styles = StyleSheet.create({
    outerbox:{
        flexDirection:'column',
        height:'100%',
        width:'100%',
        alignItems:"center"
    },
    upperbox:{
        marginTop:20,
        flex:5,
        flexDirection:'column',
        alignItems:'baseline',
    },
    middlebox:{
        flex:1,
    },
    textbox:{
        flex:1,
        flexDirection:'row',
    },
    inputbox:{
        flex:1,
        height:'50%',
        width:'60%',        
        textAlign:'center',
        margin:10,
        borderBottomColor:'black',
        borderBottomWidth:1,
    },
    buttons:{
        flex:5,
        alignItems:'center'
    },
    textbutton:{
        fontSize:18,
        padding:10,
        marginTop:10,
        marginBottom:10,
        color:'white',
        backgroundColor:'green',
        borderRadius:10
    },
    alternatebutton:{
        fontSize:15,
        color:'blue'
    }

})