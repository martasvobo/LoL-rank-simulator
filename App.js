import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Player from "./src/Player";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [player, setPlayer] = useState(new Player());
  const [rank, setRank] = useState();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("player").then((playerData) => {
      if (playerData) {
        const newPlayer = new Player(JSON.parse(playerData));
        setPlayer(newPlayer);
        setRank(newPlayer.getRankDisplay());
      } else {
        const newPlayer = new Player();
        setPlayer(newPlayer);
        setRank(newPlayer.getRankDisplay());
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("player", JSON.stringify(player));
  }, [rank]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.rankText}>{rank}</Text>
      <StatusBar style="auto" />
      <View
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        {["very easy", "easy", "medium", "hard", "very hard"].map(
          (difficulty, index) =>
            ["victory", "defeat"].map((result) => (
              <TouchableOpacity
                key={difficulty + result}
                style={{
                  ...styles.button,
                  opacity: 0.6 + index * 0.1,
                  backgroundColor: result === "victory" ? "#007bff" : "#dc3545",
                }}
                onPress={() => {
                  AsyncStorage.setItem("backup1", JSON.stringify(player));
                  player.updateAfterGame(result, difficulty);
                  setRank(player.getRankDisplay());
                }}
              >
                <Text
                  style={styles.buttonText}
                >{`${difficulty} ${result}`}</Text>
              </TouchableOpacity>
            ))
        )}
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={() => {
            const newPlayer = new Player();
            setPlayer(newPlayer);
            setRank(newPlayer.getRankDisplay(player));
          }}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.debugButton]}
          onPress={() => {
            if (!showDebug) {
              setRank(player.getDebugRankDisplay());
            } else {
              setRank(player.getRankDisplay());
            }
            setShowDebug(!showDebug);
          }}
        >
          <Text style={styles.buttonText}>Debug</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.restoreButton]}
          onPress={() => {
            AsyncStorage.getItem("backup1").then((backup) => {
              if (backup) {
                const newPlayer = new Player(JSON.parse(backup));
                setPlayer(newPlayer);
                setRank(newPlayer.getRankDisplay());
              }
            });
          }}
        >
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  rankText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    borderWidth: 1,
    width: "50%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#dc3545",
    width: "33.3%",
  },
  debugButton: {
    backgroundColor: "#ffc107",
    width: "33.3%",
  },
  restoreButton: {
    backgroundColor: "#28a745",
    width: "33.3%",
  },
});
