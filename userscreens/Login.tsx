import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../helpers/AuthContext"
import { Text,TextInput, View,StyleSheet, Pressable, NativeSyntheticEvent, TextInputEndEditingEventData, TextInputChangeEventData, ActivityIndicator} from "react-native"
import * as  React from "react"
import { NewAccount, createNewAccount, getAccountClientM, getAccountClientP } from "../helpers/DevClient"
import { AuthContext } from "../helpers/AuthContext"
import { Wallet } from "ethers"

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>



export default function Login({route,navigation}:LoginProps){

    const [loginType,setPageType]= React.useState<boolean>(true);
    const [loading,setLoading] = React.useState<boolean>(false);
    
    const [created,setCreateFlag ] = React.useState<boolean>(false);
    const {setClient,setAddr} = React.useContext(AuthContext)
    const [tempWallet,setWallet] = React.useState<Wallet>();
    //12 word key string states

    const[a,setA] = React.useState<string>("interest")
    const[b,setB] = React.useState<string>("invite")
    const[c,setC] = React.useState<string>("solution")
    const[d,setD] = React.useState<string>("own")
    const[e,setE] = React.useState<string>("box")
    const[f,setF] = React.useState<string>("fetch")
    const[g,setG] = React.useState<string>("crouch")
    const[h,setH] = React.useState<string>("fossil")
    const[i,setI] = React.useState<string>("region")
    const[j,setJ] = React.useState<string>("smile")
    const[k,setK] = React.useState<string>("calm")
    const[l,setL] = React.useState<string>("rhythm")

    const newUser = ()=>{
        const account = createNewAccount();


        const newkey = account.memonic.split(" ")
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

        setAddr(account.address)
        setWallet(account.wallet)//temporary , to wait so user can notedown memonic, there a button willset client
        setCreateFlag(true);
        console.log(account.address);
        
    }
    const oldUser = async() =>{
        let wordString = a+" "+b+" "+c+" "+d+" "+e+" "+f+" "+g+" "+h+" "+i+" "+j+" "+k+" "+l
        
        const wallet = await getAccountClientM(wordString);
        console.log("no")
        setAddr(wallet.address);
        setClient(wallet);
    }


    return(
        <View style={styles.outerbox}>
            {loading&&<ActivityIndicator size="large"/>}
            {(!loading)&&(created||loginType)&&<View style={styles.upperbox}><View style={styles.textbox}>
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
            }{(!loading)&&created?<View style={styles.buttons}>
                    <Pressable onPress={()=>{
                        
                        
                        
                        setClient(tempWallet);
                        setPageType(false);
                        setCreateFlag(false);
                        setWallet(null);
                        
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
                        
                    }}><Text style={styles.textbutton}>{"Store the words and then press here!"}</Text></Pressable></View>
                :<View style={styles.buttons}>
                <Pressable onPress={()=>{
                        setLoading(true);
                        console.log("oh")
                        if(loginType==true){
                            oldUser();
                        }
                        else{
                            newUser()
                        }
                        setLoading(false)
                    }
                    }><Text style={styles.textbutton}>{loginType ==true?"Enter keys ":"Create keys"}</Text></Pressable>
                <Pressable onPress={()=>setPageType(!loginType)}><Text style={styles.alternatebutton}>{loginType==true?"Create new keys ?":"Already have ethereum 12 word phrase?"}</Text></Pressable>
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