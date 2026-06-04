import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from './config';

const PLACEHOLDER_URL = '';

export default function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'connected' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const serverNotConfigured = API_BASE_URL === PLACEHOLDER_URL;

  const handlePress = async () => {
    if (serverNotConfigured) {
      setStatus('error');
      setErrorMsg('Server URL is not configured. Open mobile/config.js and set API_BASE_URL.');
      return;
    }

    setLoading(true);
    setResponse(null);
    setErrorMsg('');
    setStatus('idle');

    try {
      const res = await fetch(`${API_BASE_URL}/api/hello`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_action: 'button_pressed' }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.message);
      setStatus('connected');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Title */}
        <Text style={styles.title}>Hello World App</Text>

        {/* Status indicator */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              status === 'connected' && styles.dotGreen,
              status === 'error' && styles.dotRed,
              status === 'idle' && styles.dotGray,
            ]}
          />
          <Text style={styles.statusText}>
            {status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Not connected'}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePress}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Say Hello</Text>
          )}
        </TouchableOpacity>

        {/* Response display */}
        {response !== null && (
          <View style={styles.responseBox}>
            <Text style={styles.responseLabel}>Server says:</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}

        {/* Error display */}
        {status === 'error' && errorMsg !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Warning when URL not configured */}
        {serverNotConfigured && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Server URL not configured.{'\n'}
              Edit mobile/config.js and set API_BASE_URL to your deployed server URL.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  dotGray: { backgroundColor: '#a0aec0' },
  dotGreen: { backgroundColor: '#48bb78' },
  dotRed: { backgroundColor: '#fc8181' },
  statusText: {
    fontSize: 15,
    color: '#4a5568',
  },
  button: {
    backgroundColor: '#4299e1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#90cdf4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  responseBox: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  responseLabel: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  responseText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
  },
  errorBox: {
    marginTop: 20,
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#fc8181',
    borderRadius: 8,
    padding: 14,
    width: '100%',
  },
  errorText: {
    color: '#c53030',
    fontSize: 14,
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: '#fffbeb',
    borderLeftWidth: 4,
    borderLeftColor: '#f6ad55',
    borderRadius: 8,
    padding: 14,
    width: '100%',
  },
  warningText: {
    color: '#744210',
    fontSize: 13,
    lineHeight: 20,
  },
});
