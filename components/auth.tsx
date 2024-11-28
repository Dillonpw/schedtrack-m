import React, { useState } from 'react';
import {
    Alert,
    View,
    TextInput,
    Text,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { supabase } from '../utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function signInWithEmail() {
        // Validate inputs before submission
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError(''); // Clear any previous errors

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) {
                // More specific error handling
                switch (error.message) {
                    case 'Invalid login credentials':
                        setError('Incorrect email or password');
                        break;
                    case 'Email not confirmed':
                        setError('Please verify your email first');
                        break;
                    default:
                        setError(
                            'An unexpected error occurred. Please try again.'
                        );
                }
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }

    async function signUpWithEmail() {
        // Validate inputs
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password strength check
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError(''); // Clear any previous errors

        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
            });

            if (error) {
                // More specific error handling
                switch (error.message) {
                    case 'User already exists':
                        setError('An account with this email already exists');
                        break;
                    default:
                        setError(
                            error.message || 'Sign up failed. Please try again.'
                        );
                }
            } else if (!session) {
                // Successful signup, but needs email verification
                Alert.alert(
                    'Verification Needed',
                    'Please check your inbox for email verification!'
                );
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView className="flex justify-center px-4 gap-6">
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">
                        Authentication
                    </Text>

                    {/* Error Message Display */}
                    {error ? (
                        <View className="bg-red-100 p-3 rounded-md mb-4">
                            <Text className="text-red-700">{error}</Text>
                        </View>
                    ) : null}

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Email
                        </Text>
                        <TextInput
                            className="border border-gray-300 rounded-md px-4 py-2 text-base"
                            onChangeText={(text) => {
                                setEmail(text);
                                setError(''); // Clear error when user starts typing
                            }}
                            value={email}
                            placeholder="email@address.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Password
                        </Text>
                        <TextInput
                            className="border border-gray-300 rounded-md px-4 py-2 text-base"
                            onChangeText={(text) => {
                                setPassword(text);
                                setError(''); // Clear error when user starts typing
                            }}
                            value={password}
                            placeholder="Password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View className="space-y-4">
                        <Pressable
                            className={`bg-blue-500 rounded-md py-3 ${
                                loading ? 'opacity-50' : 'active:opacity-80'
                            }`}
                            onPress={signInWithEmail}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-center text-white font-medium text-base">
                                    Sign in
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            className={`bg-green-500 rounded-md py-3 ${
                                loading ? 'opacity-50' : 'active:opacity-80'
                            }`}
                            onPress={signUpWithEmail}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-center text-white font-medium text-base">
                                    Sign up
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
