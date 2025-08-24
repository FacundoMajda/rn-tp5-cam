import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginResult, setLoginResult] = useState<boolean | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  if (loginResult === true) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.description}>
          Acceso concedido por reconocimiento facial.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setLoginResult(null);
            setIsLoginScreen(true);
          }}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📷 Acceso a Cámara</Text>
        <Text style={styles.description}>
          Esta aplicación necesita acceso a la cámara para el reconocimiento
          facial
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFacialLogin = async () => {
    console.log("handleFacialLogin ejecutado");
    if (!cameraRef.current) {
      Alert.alert("Error", "Cámara no disponible");
      return;
    }
    setIsLoginScreen(false);
    setIsProcessing(true);
    setLoginResult(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo) {
        setIsProcessing(false);
        return;
      }

      console.log("Imagen capturada:", photo.uri);

      // simulacro del proceso de reconocimiento facial
      setTimeout(() => {
        console.log("Reconocimiento simulado ejecutado");
        setIsProcessing(false);
        const loginSuccessful = Math.random() > 0.5;
        setLoginResult(loginSuccessful);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error capturando imagen:", error);
      Alert.alert("Error", "No se pudo capturar la imagen");
    }
  };

  if (isLoginScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔐 Login Facial</Text>
        <Text style={styles.description}>
          Utiliza el reconocimiento facial para acceder a la aplicación
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setIsLoginScreen(false)}
        >
          <Text style={styles.buttonText}>Iniciar Login Facial</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsLoginScreen(true)}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faceGuideContainer}>
          <View style={styles.faceGuide}>
            <Text style={styles.guideText}>
              Posiciona tu rostro dentro del círculo
            </Text>
          </View>
        </View>

        <View style={styles.captureControls}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.processingText}>
                Procesando reconocimiento facial...
              </Text>
            </View>
          ) : (
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleFacialLogin}
              >
                <Text style={styles.captureEmoji}>📸</Text>
              </TouchableOpacity>
              <Text style={styles.captureText}>Toca para capturar</Text>
              {loginResult === false && (
                <Text
                  style={{ color: "#f00", fontWeight: "bold", marginTop: 10 }}
                >
                  Login Fallido
                </Text>
              )}
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  primaryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  backButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  faceGuideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  faceGuide: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  guideText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    bottom: -50,
  },

  captureControls: {
    paddingBottom: 50,
    alignItems: "center",
  },

  processingContainer: {
    alignItems: "center",
  },

  processingText: {
    color: "white",
    fontSize: 16,
    marginTop: 15,
    fontWeight: "500",
  },

  captureContainer: {
    alignItems: "center",
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  captureEmoji: {
    fontSize: 30,
  },

  captureText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
