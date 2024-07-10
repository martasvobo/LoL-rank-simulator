import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Player from "./src/Player";

export default function App() {
  const [player, setPlayer] = useState(new Player());
  const [rank, setRank] = useState();

  return (
    <View style={styles.container}>
      <Text>{rank}</Text>
      <StatusBar style="auto" />
      <Button
        title={"easy victory"}
        onPress={() => {
          player.updateAfterGame("victory", "veryEasy");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy victory"}
        onPress={() => {
          player.updateAfterGame("victory", "easy");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy victory"}
        onPress={() => {
          player.updateAfterGame("victory", "medium");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy victory"}
        onPress={() => {
          player.updateAfterGame("victory", "hard");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy victory"}
        onPress={() => {
          player.updateAfterGame("victory", "veryHard");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy defeat"}
        onPress={() => {
          player.updateAfterGame("defeat", "veryEasy");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy defeat"}
        onPress={() => {
          player.updateAfterGame("defeat", "easy");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy defeat"}
        onPress={() => {
          player.updateAfterGame("defeat", "medium");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy defeat"}
        onPress={() => {
          player.updateAfterGame("defeat", "hard");
          setRank(player.getRankDisplay());
        }}
      />
      <Button
        title={"easy defeat"}
        onPress={() => {
          player.updateAfterGame("defeat", "veryHard");
          setRank(player.getRankDisplay());
        }}
      />

      <Button
        title={"reset"}
        onPress={() => {
          setPlayer(new Player());
          setRank(player.getRankDisplay(player));
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
