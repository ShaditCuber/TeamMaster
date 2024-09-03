import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import { useCompetition, useCompetitions } from "../queries/competitions";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "../components/PDFS/PDF";
import { pdf } from "@react-pdf/renderer";
import { ClearIcon } from "../Icons/Icons";

const ScoreCard = () => {

    const [roundsData, setRoundsData] = useState([]);
    const [numberOfGroups, setNumberOfGroups] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showScoreCard, setShowScoreCard] = useState(false);
    const [categories, setCategories] = useState([]);

    const [t, i18n] = useTranslation("global");


    let competition_id;

    const location = useLocation();

    try {
        competition_id = location.state.competition_id;
    } catch (error) {
        window.location.href = "/scoreCard";
    }

    console.log(competition_id)


    const { data, isLoading } = useCompetition(competition_id);
    const [imageUrl, setImageUrl] = useState(null);


    console.log(data)




    // debo obtener los resultados de cada ronda

    // useEffect(() => {
    //     if (data) {
    //         const newRoundsData = data.events.flatMap(event =>
    //             event.rounds.map(round => {

    //                 const { advancementCondition, results } = round;

    //                 let filteredResults = [];
    //                 if (advancementCondition?.type === 'percent') {
    //                     const totalCompetitors = results.length;
    //                     const count = Math.ceil(totalCompetitors * (advancementCondition.level / 100));
    //                     filteredResults = results.slice(0, count);
    //                 } else if (advancementCondition?.type === 'ranking') {
    //                     filteredResults = results.slice(0, advancementCondition.level);
    //                 } else {
    //                     filteredResults = results;
    //                 }

    //                 // mapear los resultados para obtener solo los datos necesarios y agregar los datos del competidor

    //                 filteredResults = filteredResults.map(result => {
    //                     const { personId } = result;
    //                     const competitor = data.persons.find(person => person.registrantId === personId);
    //                     const timeLimit = round?.timeLimit?.centiseconds;
    //                     const timeCutoff = round?.cutoff?.attemptResult;
    //                     const numberOfAttempts = round?.cutoff?.numberOfAttempts;
    //                     console.log(timeLimit, timeCutoff, 'timeLimit, timeCutoff', 'event', event.id, 'round', round.id, numberOfAttempts, 'numberOfAttempts')

    //                     // obtener del competidor solo los datos necesarios nombre y wcaid
    //                     const { name, wcaId } = competitor;
    //                     return {
    //                         numberOfAttempts,
    //                         timeCutoff,
    //                         timeLimit,
    //                         personId,
    //                         name,
    //                         wcaId,
    //                     };
    //                 }

    //                 );

    //                 return {
    //                     eventId: event.id,
    //                     roundId: round.id,
    //                     competitors: filteredResults,
    //                 };
    //             })
    //         );

    //         // quitar las rondas primeras '-r1'



    //         // desde segunda ronda en adelante
    //         // setRoundsData(newRoundsData.filter(round => !round.roundId.includes('-r1')));

    //         setRoundsData(newRoundsData);

    //     }
    // }, [data]);

    const roundText = t("round")

    useEffect(() => {
        if (data) {
            const newRoundsData = data.events.flatMap(event => {
                // Mapear las rondas para acceder a ellas fácilmente
                const roundsByEvent = event.rounds.reduce((acc, round) => {
                    acc[round.id] = round;
                    return acc;
                }, {});

                return event.rounds.map((round) => {
                    const { advancementCondition, results } = round;

                    let filteredResults = [];

                    // Obtener la ronda anterior
                    const previousRoundId = `r${parseInt(round.id.split('-r')[1]) - 1}`;
                    const previousRound = roundsByEvent[`${event.id}-${previousRoundId}`];


                    if (previousRound && previousRound.advancementCondition) {
                        const previousResults = previousRound.results;
                        // console.log(round.id, 'round.id')
                        // console.log(advancementCondition.level, 'advancementCondition.level')
                        // console.log(advancementCondition.type, 'advancementCondition.type')
                        // console.log(previousResults.length, 'previousResults.length')
                        if (previousRound.advancementCondition.type === 'percent') {
                            const totalCompetitors = previousResults.length;
                            const count = Math.trunc(totalCompetitors * (previousRound.advancementCondition.level / 100));
                            console.log(count)
                            filteredResults = previousResults.slice(0, count);
                        } else if (previousRound.advancementCondition.type === 'ranking') {
                            filteredResults = previousResults.slice(0, previousRound.advancementCondition.level);
                        }
                    } else {
                        filteredResults = results;
                    }

                    // Mapear los resultados para obtener solo los datos necesarios y agregar los datos del competidor
                    filteredResults = filteredResults.map(result => {
                        const { personId } = result;
                        const competitor = data.persons.find(person => person.registrantId === personId);
                        const timeLimit = round?.timeLimit?.centiseconds;
                        const timeCutoff = round?.cutoff?.attemptResult;
                        const numberOfAttempts = round?.cutoff?.numberOfAttempts;

                        // Obtener del competidor solo los datos necesarios: nombre y wcaId
                        const { name, wcaId } = competitor;
                        return {
                            numberOfAttempts,
                            timeCutoff,
                            timeLimit,
                            personId,
                            name,
                            wcaId,
                        };
                    });


                    return {
                        eventId: event.id,
                        roundId: round.id,
                        competitors: filteredResults,
                    };
                });
            });

            console.log(newRoundsData);

            // setRoundsData(newRoundsData.filter(round => !round.roundId.includes('-r1') && round.competitors.length > 0));
            // Guardar los datos de las rondas
            setRoundsData(newRoundsData);
        }

        const categories = data?.events.map(event => {
            return {
                id: event.id,
            };
        });

        console.log(categories)
        setCategories(categories);


    }, [data]);





    if (isLoading) {
        return <Loader />;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'c6y2lary');

        setLoading(true);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dlyzvzi9o/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url);
        } catch (error) {
            console.error("Error al subir la imagen", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (eventId, roundId, competitors) => {

        const round = parseInt(roundId.split('-r')[1]);


        const doc = <PDF
            imageUrl={imageUrl}
            competitors={competitors}
            tournamentName={data.name}
            category={eventId}
            totalGroups={numberOfGroups}
            round={round}
            i18n={i18n}
        />;

        const pdfBlob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `scoreCard-${eventId}-Round-${roundId}.pdf`;
        link.click();
    };

    const handleNumberOfGroups = (e) => {
        setNumberOfGroups(e.target.value);
    }

    const handleGenerateScoreCards = () => {
        setShowScoreCard(!showScoreCard);
    }



    return (
        <div className="container mx-auto px-4 animate-fade-in animate-delay-200 animate-duration-slow">

            <h1 className="text-2xl font-bold mb-4">Score Card</h1>

            {/* <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
            /> */}
            <input
                type="file"
                accept=".png"
                className="hidden"
                id="imageInput"
            />
            <label
                htmlFor="imageInput"
                className="cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 inline-block min-w-min"
                title={t("image-title")}
            >
                {t("select-image")}
            </label>
            {imageUrl && (
                <div className="flex flex-col items-center">
                    <button
                        className="cursor-pointer text-red-500 mt-2"
                        onClick={() => setImageUrl(null)}
                    >
                        xd
                        <ClearIcon />
                    </button>
                </div>
            )}


            {/* input para ingresar cantidad de grupos  */}
            <div className="mb-4">
                <label htmlFor="numberOfGroups" className="block text-gray-700 text-sm font-bold mb-2">
                    Cantidad de Grupos
                </label>
                <input
                    type="number"
                    id="numberOfGroups"
                    min={1}
                    placeholder="Cantidad de grupos"
                    onChange={handleNumberOfGroups}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <button
                onClick={handleGenerateScoreCards}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Generar ScoreCards
            </button>


            <br /><br />

            {/* {
                showScoreCard && (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 p-4">
                            <h2 className="text-lg font-bold mb-2">Categorías</h2>
                            <ul>
                                {categories.map((category, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="text-gray-700">{category.id}</span>
                                        <ul className="ml-4 mt-2">
                                            {roundsData
                                                .filter((round) => round.eventId === category.id)
                                                .map(({ roundName, roundId, competitors }, index) => (
                                                    <li key={index} className="text-blue-500 hover:underline">
                                                        <button
                                                            onClick={() => handleDownloadPDF(category.id, roundId, competitors)}
                                                        >
                                                            {roundId}
                                                        </button>
                                                    </li>
                                                ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            } */}
            {
                showScoreCard && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                           
                            <tbody>
                                {categories.map((category, categoryIndex) => (
                                    <tr key={categoryIndex} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 font-medium">{t(category.id)}</td>
                                        {roundsData
                                            .filter((round) => round.eventId === category.id)
                                            .map(({ roundId, competitors }, index) => (
                                                <td key={index} className="px-6 py-4 border-b border-gray-200 text-center">
                                                    <button
                                                        onClick={() => handleDownloadPDF(category.id, roundId, competitors)}
                                                        disabled={roundId.includes('-r1')}
                                                        className={`px-4 py-2 text-sm rounded-md transition ${roundId.includes('-r1')
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        {t("round")} {roundId.split('-r')[1]}
                                                    </button>
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }



            {/* <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="w-full bg-gray-100 border-b border-gray-200">
                        <th className="px-4 py-2 text-left">Evento</th>
                        <th className="px-4 py-2 text-left">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {roundsData?.map(({ eventId, roundId, competitors, roundName }, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border-b border-gray-200">{eventId} {roundText} {roundId.split('-r')[1]}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button
                                    onClick={() => handleDownloadPDF(eventId, roundId, competitors)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Descargar PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}


        </div>
    );

};

export default ScoreCard;
