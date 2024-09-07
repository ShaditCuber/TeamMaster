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
import React from 'react';




const PDF = ({ imageUrl = null, competitors, tournamentName, category, categoryName, totalGroups, round, timeLimit, timeCutoff, numberOfAttempts, i18n }) => {

    const enText = {
        "round": "Round",
        "group": "Group",
        "of": "of",
        "333": "3x3x3 Cube",
        "222": "2x2x2 Cube",
        "444": "4x4x4 Cube",
        "555": "5x5x5 Cube",
        "minx": "Megaminx",
        "pyram": "Pyraminx",
        "clock": "Clock",
        "skewb": "Skewb",
        "sq1": "Square-1",
        "333oh": "3x3x3 One-Handed",
        "666": "6x6x6 Cube",
        "777": "7x7x7 Cube",
        "333bf": "3x3x3 Blindfolded",
        "333fm": "3x3x3 Fewest Moves",
        "333ft": "3x3x3 With Feet",
        "444bf": "4x4x4 Blindfolded",
        "555bf": "5x5x5 Blindfolded",
        "333mbf": "3x3x3 Multi-Blind"
    }

    const esText = {
        "round": "Ronda",
        "group": "Grupo",
        "of": "de",
        "333": "Cubo 3x3x3",
        "222": "Cubo 2x2x2",
        "444": "Cubo 4x4x4",
        "555": "Cubo 5x5x5",
        "minx": "Megaminx",
        "pyram": "Pyraminx",
        "clock": "Clock",
        "skewb": "Skewb",
        "sq1": "Square-1",
        "333oh": "3x3x3 Una Mano",
        "666": "Cubo 6x6x6",
        "777": "Cubo 7x7x7",
        "333bf": "3x3x3 A Ciegas",
        "333fm": "3x3x3 Menos Movimientos",
        "333ft": "3x3x3 Con los Pies",
        "444bf": "4x4x4 A Ciegas",
        "555bf": "5x5x5 A Ciegas",
        "333mbf": "3x3x3 Multiples A Ciegas",
    }


    const roundText = i18n.language === 'en' ? enText['round'] : esText['round'];
    const groupText = i18n.language === 'en' ? enText['group'] : esText['group'];
    const ofText = i18n.language === 'en' ? enText['of'] : esText['of'];
    const resultText = i18n.language === 'en' ? 'Result DNF if' : 'Resultado DNF si';
    const continueIf = i18n.language === 'en' ? 'Continue if' : 'Continua si';


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


    const mean_of_three_events = [
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

    const textTimeCutoff = timeCutoff ? `------- ${continueIf} ${numberOfAttempts === 2 ? '1 o 2' : '1'} < ${timeCutoff} -------` : `-------  -------`;

    const rows = mean_of_three_events.includes(category) ? [3] : [3, 4, 5];
    const fillRows = 3 - rows.length;
    const competitorChunks = chunkArray(competitors, 4);

    return (
        <Document>
            {competitorChunks.map((chunk, chunkIndex) => (
                <Page size="A4" style={styles.page} key={chunkIndex}>
                    {chunk.map((competitor) => (
                        <View style={styles.container} key={competitor.registrantId}>
                            <Image src={IconTeamMaster} style={styles.logo} />

                            <Text style={styles.title}>{tournamentName}</Text>
                            <Text style={styles.category}>{categoryName}</Text>
                            <Text style={styles.header}>
                                {roundText} {round} | {groupText} {competitor.groupNumber} {ofText} {totalGroups}
                            </Text>

                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.competitor}>| {competitor.registrantId} | {competitor.name} | {competitor.wcaId} | </Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.narrowCell}>A</Text>
                                    <Text style={styles.narrowCell}>S</Text>
                                    <Text style={styles.wideCell}>{resultText} &gt; = {timeLimit}</Text>
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
                                    {/* {
                                        competitor.timeCutoff
                                            ? `------- ${continueIf} ${competitor.numberOfAttempts === 2 ? '1 o 2' : '1'} < ${formatCentiseconds(competitor.timeCutoff)} -------`
                                            : `-------  -------`
                                    } */}
                                    {textTimeCutoff}
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

                            {
                                imageUrl && <Image src={imageUrl} style={styles.watermark} />
                            }
                        </View>
                    ))}
                </Page>
            ))}
        </Document>
    );
}

export default PDF;