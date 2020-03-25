import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, TouchableOpacity, ImageBackground } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import AuthInput from '../components/authInput';
import backgroundImage from '../../assets/imgs/login1.jpg';

export default class AuthOtherPlatform extends Component {
    state = {
        userInfo: null,
        error: null,
    };

    async componentDidMount() {
        this._configureGoogleSignIn();
        await this._getCurrentUser();
    }

    _configureGoogleSignIn() {
        GoogleSignin.configure({
            webClientId: '899280875089-dptsunvrb98gj08hbtngell06bav5kf2.apps.googleusercontent.com',
            offlineAccess: false,
        });
    }

    async _getCurrentUser() {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            this.setState({ userInfo, error: null });
        } catch (error) {
            const errorMessage =
                error.code === statusCodes.SIGN_IN_REQUIRED ? 'Please sign in :)' : error.message;
            this.setState({
                error: new Error(errorMessage),
            });
        }
    }

    render() {
        const { userInfo } = this.state;

        const body = userInfo ? this.renderUserInfo(userInfo) : this.renderSignInButton();
        return (
            <ImageBackground source={backgroundImage}
                style={styles.backgound}>
                <Text style={styles.title}>Manager</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : null}
                    </Text>

                    <View style={styles.loginGoogle}>
                        {this.renderIsSignedIn()}
                        {this.renderGetCurrentUser()}
                        {this.renderGetTokens()}
                        {body}
                    </View>

                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Nome' style={styles.input}
                            value={this.state.name} onChangeText={name => this.setState({ name })} />
                    }

                    <AuthInput icon='at' placeholder='E-mail' style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })} />

                    <AuthInput icon='lock' secureTextEntry={true}
                        placeholder='Senha' style={styles.input} value={this.state.password}
                        onChangeText={password => this.setState({ password })} />

                    {this.state.stageNew &&
                        <AuthInput icon='asterisk' secureTextEntry={true}
                            placeholder='Confirmar Senha' style={styles.input} value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />
                    }
                    <TouchableOpacity onPress={this.signinOrSignup}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, marginTop: 15, alignItems: 'center' }}
                        onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    renderIsSignedIn() {
        return (
            <Button
                onPress={async () => {
                    const isSignedIn = await GoogleSignin.isSignedIn();
                    Alert.alert(String(isSignedIn));
                }}
                title="is user signed in?"
            />
        );
    }

    renderGetCurrentUser() {
        return (
            <Button
                onPress={async () => {
                    const userInfo = await GoogleSignin.getCurrentUser();
                    Alert.alert('current user', userInfo ? JSON.stringify(userInfo.user) : 'null');
                }}
                title="get current user"
            />
        );
    }

    renderGetTokens() {
        return (
            <Button
                onPress={async () => {
                    const isSignedIn = await GoogleSignin.getTokens();
                    Alert.alert('tokens', JSON.stringify(isSignedIn));
                }}
                title="get tokens"
            />
        );
    }

    renderUserInfo(userInfo) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
                    Welcome {userInfo.user.name}
                </Text>
                <Text>Your user info: {JSON.stringify(userInfo.user)}</Text>

                <Button onPress={this._signOut} title="Log out" />
                {this.renderError()}
            </View>
        );
    }

    renderSignInButton() {
        return (
            <View style={styles.loginGoogle}>
                <GoogleSigninButton
                    style={{ width:250, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Auto}
                    onPress={this._signIn}
                />
                {this.renderError()}
            </View>
        );
    }

    renderError() {
        const { error } = this.state;
        if (!error) {
            return null;
        }
        const text = `${error.toString()} ${error.code ? error.code : ''}`;
        return <Text>{text}</Text>;
    }

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            Alert.alert(userInfo);
            this.setState({ userInfo, error: null });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // sign in was cancelled
                Alert.alert('cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation in progress already
                Alert.alert('in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('play services not available or outdated');
            } else {
                Alert.alert('Something went wrong', error.toString());
                this.setState({
                    error,
                });
            }
        }
    };

    _signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

            this.setState({ userInfo: null, error: null });
        } catch (error) {
            this.setState({
                error,
            });
        }
    };
}

const styles = StyleSheet.create({
    loginGoogle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    backgound: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'shelter',
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: 'Lato',
        color: '#FFF',
        fontSize: 20,
        alignSelf: 'center',
    },
    orTitle: {
        fontFamily: 'Lato',
        color: '#FFF',
        fontSize: 20,
        alignSelf: 'center',
        paddingBottom: 10,
        marginBottom: 15,
        borderBottomWidth: 0.7,
        borderColor: '#fff',
        width: '100%'
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
        borderRadius: 3,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        borderRadius: 3,
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 3
    },
    buttonText: {
        fontFamily: 'Lato',
        color: '#FFF',
        fontSize: 20
    }
});