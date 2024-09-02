import {
    Document,
    Text,
    Page,
    StyleSheet,
    View,
    Image,
    Font,
} from '@react-pdf/renderer';
import IconTeamMaster from '/teamMaster.png';
import CK from '/CK.png';
import React from 'react';
import { formatCentiseconds } from '@wca/helpers';


function PDF({ imageUrl ,competitors, tournamentName, category, totalGroups, round }) {

    const groupNum = 1;
    // const registrantId = '2021DO01';
    // const competitorName = 'Juan Pérez';
    // const wcaId = '2019PERE01';
    const timeLimit = '10:00';
    const timeCuttof = '02:35'


    // const listCompetitors = [
    //     {
    //         registrantID: 2,
    //         name: 'Juan Pérez',
    //         wcaID: '2019PERE01',
    //     },
    //     {
    //         registrantID: 1,
    //         name: 'Pedro Pérez',
    //         wcaID: '2019PERE02',
    //     },
    // ]

    console.log(competitors[0]);


    // transformar la imagen en escala de grises con css

    // const img = image;

    // document.getElementsByName('img').style.filter = 'grayscale(100%)';



    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });
    Font.register({
        family: 'Roboto',
        src: 'http://themes.googleusercontent.com/static/fonts/roboto/v9/zN7GBFwfMP4uA6AR0HCoLQ.ttf'
    })

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    // def centiseconds_to_minutes_seconds(centiseconds):
    // if centiseconds is None:
    // return None
    // seconds = centiseconds / 100

    // minutes = int(seconds // 60)
    // seconds %= 60

    // time_string = "{:02}:{:02}".format(minutes, int(seconds))

    // return time_string


    



    const mean_of_three_events = [
        '333fm',
        '666',
        '777',
        '333bf',
        '444bf',
        '555bf',
    ]


    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            //padding: 10,
        },
        container: {
            width: '50%',
            padding: 10,
            border: '1pt solid #000',
            position: 'relative',
        },
        title: {
            fontSize: 25, // Título más grande
            textAlign: 'center',
            fontWeight: '900', // Negrita
            fontFamily: 'Roboto',
            marginBottom: 5,
            marginTop: 30
        },
        category: {
            fontSize: 10,
            textAlign: 'center',
            marginBottom: 5,
            fontStyle: 'italic', // Italic
        },
        header: {
            fontSize: 9,
            textAlign: 'center',
            marginBottom: 5,
        },
        logo: {
            position: 'absolute',
            top: 10,
            left: 10,
            width: 30,
            height: 30,
            opacity: 0.5,
        },
        watermark: {
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-80%, -50%)',
            width: 180,
            opacity: 0.3,
        },
        table: {
            width: '100%',
            borderStyle: 'solid',
            borderColor: '#000',
            borderWidth: 1, // Asegurarse de que el borde sea visible
            borderCollapse: 'collapse', // Colapsar los bordes
            marginTop: 5,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCell: {
            borderWidth: 1,
            borderColor: '#000',
            padding: 5,
            textAlign: 'center',
        },
        wideCell: {
            borderWidth: 1,
            borderColor: '#000',
            padding: 5,
            textAlign: 'center',
            width: '80%',
            fontSize: 10, // Reducir tamaño de fuente
        },
        narrowCell: {
            borderWidth: 1,
            borderColor: '#000',
            padding: 5,
            textAlign: 'center',
            width: '13%',
            fontSize: 10, // Reducir tamaño de fuente
        },
        competitor: {
            borderWidth: 1,
            borderColor: '#000',
            padding: 5,
            textAlign: 'center',
            width: '100%',
            fontSize: 9.5,
        },
        footer: {
            marginTop: 5,
            marginBottom: 5,
            fontSize: 10,
            textAlign: 'center',
        },
        emptyRow: {
            height: 23,
        },
    });


    const rows = mean_of_three_events.includes(category) ? [3] : [3, 4, 5];
    const fillRows = 3-rows.length;
    const competitorChunks = chunkArray(competitors, 4);

    return (
        <Document>
            {competitorChunks.map((chunk, chunkIndex) => (
                <Page size="A4" style={styles.page} key={chunkIndex}>
                    {chunk.map((competitor) => (
                        <View style={styles.container} key={competitor.personId}>
                            <Image src={IconTeamMaster} style={styles.logo} />

                            <Text style={styles.title}>{tournamentName}</Text>
                            <Text style={styles.category}>{category}</Text>
                            <Text style={styles.header}>
                                Ronda {round} | Grupo {groupNum} de {totalGroups}
                            </Text>

                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.competitor}>| {competitor.personId} | {competitor.name} | {competitor.wcaId} | </Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.narrowCell}>A</Text>
                                    <Text style={styles.narrowCell}>S</Text>
                                    <Text style={styles.wideCell}>Resultado DNF SI &gt; = {formatCentiseconds(competitor.timeLimit)}</Text>
                                    <Text style={styles.narrowCell}>J</Text>
                                    <Text style={styles.narrowCell}>C</Text>
                                </View>
                                {[1, 2].map((row, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <Text style={styles.narrowCell}>{row}</Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.wideCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                    </View>
                                ))}

                                <Text style={styles.footer}>
                                    {
                                        competitor.timeCutoff
                                            ? `------- Continúa si ${competitor.numberOfAttempts === 2 ? '1 o 2' : '1'} < ${formatCentiseconds(competitor.timeCutoff)} -------`
                                            : `-------  -------`
                                    }
                                </Text>


                                {rows.map((row, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <Text style={styles.narrowCell}>{row}</Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.wideCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                    </View>
                                ))}
                                <Text style={styles.footer}>-------Extra-------</Text>
                                {['E1', 'E2'].map((row, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <Text style={styles.narrowCell}>{row}</Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.wideCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                        <Text style={styles.narrowCell}></Text>
                                    </View>
                                ))}
                                {[...Array(fillRows)].map((_, idx) => (
                                    <View style={styles.emptyRow} key={idx}></View>
                                ))}
                            </View>

                            <Image
                                src={imageUrl}
                                style={styles.watermark}
                            />
                        </View>
                    ))}
                </Page>
            ))}
        </Document>
    );
}

export default PDF;