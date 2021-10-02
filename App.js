import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import ListItem from "./components/ListItem";

import {BottomSheetModal, BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import Chart from "./components/Chart";
import {getMarketData} from "./services/cryptoService";


const ListHeader = () => {


    return (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Markets</Text>


            </View>
            <View style={styles.divider}/>
        </>
    )

}

export default function App() {


    const [filteredData, setFilteredData] = useState([])
    const [masterData, setMasterData] = useState([])
    const [selectedCoinData, setSelectedCoinData] = useState(null)


    const [searchCoin, setSearchCoin] = useState('')

    // console.log(getMarketData)

    function searchFilter(text) {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ' '.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearchCoin(text)
        } else {
            setFilteredData(masterData)
            setSearchCoin(text)

        }

    }

    useEffect(() => {

        const fetchMarketData = async () => {
            const marketData = await getMarketData()
            setFilteredData(marketData)
            setMasterData(marketData)

        }

        fetchMarketData();
    }, [])


    // ref
    const bottomSheetModalRef = useRef(null);

// variables
    const snapPoints = useMemo(() => ['45%'], []);

    const openModal = (item) => {
        setSelectedCoinData(item)
        bottomSheetModalRef.current.present()
    }


    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={styles.container}>

                <FlatList
                    keyExtractor={(item) => item.id}
                    data={filteredData}
                    renderItem={({item}) => (
                        <ListItem
                            name={item.name.toUpperCase()}
                            symbol={item.symbol}
                            currentPrice={item.current_price}
                            priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
                            logoUrl={item.image}
                            onPress={() =>
                                openModal(item)
                            }
                        />
                    )}
                    ListHeaderComponent={

                        <>
                            <ListHeader/>

                            <TextInput
                                placeholder={'Search...'}
                                value={searchCoin}
                                onChangeText={(text) => searchFilter(text)}
                                style={{
                                    borderRadius: 5,
                                    borderColor: 'blue',
                                    borderWidth: 0.2,
                                    height: 30,
                                    paddingLeft: 10,
                                    marginHorizontal: 15
                                }}
                            />

                        </>

                    }
                />

                <StatusBar style="auto"/>
            </SafeAreaView>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                style={styles.bottomSheet}
                snapPoints={snapPoints}>

                {selectedCoinData ? (
                    <Chart
                        currentPrice={selectedCoinData.current_price}
                        logoUrl={selectedCoinData.image}
                        name={selectedCoinData.name}
                        symbol={selectedCoinData.symbol}
                        priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
                        sparkline={selectedCoinData?.sparkline_in_7d.price}
                    />
                ) : null}

            </BottomSheetModal>

        </BottomSheetModalProvider>


    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleWrapper: {
        marginTop: 40,
        paddingHorizontal: 16,
    },
    largeTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginTop: 16,
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
});
