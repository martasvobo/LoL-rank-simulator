import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Player from "./src/Player";
import { getRankDisplay } from "./src/elo";

export default function App() {
  const [player, setPlayer] = useState(new Player());
  const [rank, setRank] = useState();

  return (
    <View style={styles.container}>
      <Text>{rank}</Text>
      <StatusBar style="auto" />
      <Button
        title={"easy win"}
        onPress={() => player.updateAfterGame("win", "easy")}
      />
      <Button
        title={"easy loss"}
        onPress={() => player.updateAfterGame("loss", "easy")}
      />
      <Button
        title={"medium win"}
        onPress={() => player.updateAfterGame("win", "medium")}
      />
      <Button
        title={"medium loss"}
        onPress={() => player.updateAfterGame("loss", "medium")}
      />
      <Button
        title={"hard win"}
        onPress={() => player.updateAfterGame("win", "hard")}
      />
      <Button
        title={"hard loss"}
        onPress={() => player.updateAfterGame("loss", "hard")}
      />
      <Button
        title="show rank"
        onPress={() => {
          setRank(getRankDisplay(player));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
