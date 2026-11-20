import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

// A45 step 1: planned row layout (D1). Same deterministic data and formatting as the Compose app.
// Integer arithmetic only, so both apps format identical strings.

type Asset = {
  id: string;
  name: string;
  symbol: string;
  priceCents: number;
  changeBp: number; // percentage change in basis points (1 bp = 0.01 %)
};

const N = 500;

const DATA: Asset[] = Array.from({length: N}, (_, i) => ({
  id: String(i),
  name: `Asset ${i}`,
  symbol: `A${String(i).padStart(3, '0')}`,
  priceCents: 10000 + ((i * 3737) % 90000),
  changeBp: ((i * 1313) % 4100) - 2000,
}));

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const formatPrice = (cents: number) => `${Math.floor(cents / 100)}.${pad2(cents % 100)}`;

const formatChange = (bp: number) => {
  const abs = Math.abs(bp);
  const sign = bp > 0 ? '+' : bp < 0 ? '-' : '';
  return `${sign}${Math.floor(abs / 100)}.${pad2(abs % 100)}%`;
};

const arrow = (bp: number) => (bp > 0 ? '▲' : bp < 0 ? '▼' : '–');
const changeColor = (bp: number) => (bp > 0 ? '#1B7F3B' : bp < 0 ? '#C62828' : '#666666');

const AssetRow = ({item}: {item: Asset}) => (
  <View style={styles.row}>
    <View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.symbol}>{item.symbol}</Text>
    </View>
    <View style={styles.right}>
      <Text style={styles.price}>{formatPrice(item.priceCents)}</Text>
      <Text style={[styles.change, {color: changeColor(item.changeBp)}]}>
        {`${arrow(item.changeBp)} ${formatChange(item.changeBp)}`}
      </Text>
    </View>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          testID="asset_list"
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({item}) => <AssetRow item={item} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  row: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  right: {alignItems: 'flex-end'},
  name: {fontSize: 16, lineHeight: 20, color: '#000000', includeFontPadding: false},
  symbol: {fontSize: 12, lineHeight: 16, color: '#666666', includeFontPadding: false},
  price: {fontSize: 16, lineHeight: 20, color: '#000000', includeFontPadding: false},
  change: {fontSize: 12, lineHeight: 16, includeFontPadding: false},
});