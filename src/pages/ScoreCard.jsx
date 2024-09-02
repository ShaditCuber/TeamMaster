import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import { useCompetition, useCompetitions } from "../queries/competitions";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "../components/PDFS/PDF";
import { pdf } from "@react-pdf/renderer";

const ScoreCard = () => {

    const [roundsData, setRoundsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation("global");

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

    useEffect(() => {
        if (data) {
            const newRoundsData = data.events.flatMap(event =>
                event.rounds.map(round => {
                    const { advancementCondition, results } = round;

                    let filteredResults = [];
                    if (advancementCondition?.type === 'percent') {
                        const totalCompetitors = results.length;
                        const count = Math.ceil(totalCompetitors * (advancementCondition.level / 100));
                        filteredResults = results.slice(0, count);
                    } else if (advancementCondition?.type === 'ranking') {
                        filteredResults = results.slice(0, advancementCondition.level);
                    } else {
                        filteredResults = results;
                    }

                    // mapear los resultados para obtener solo los datos necesarios y agregar los datos del competidor

                    filteredResults = filteredResults.map(result => {
                        const { personId } = result;
                        const competitor = data.persons.find(person => person.registrantId === personId);
                        const timeLimit = round?.timeLimit?.centiseconds;
                        const timeCutoff = round?.cutoff?.attemptResult;
                        const numberOfAttempts = round?.cutoff?.numberOfAttempts;
                        console.log(timeLimit, timeCutoff, 'timeLimit, timeCutoff', 'event', event.id, 'round', round.id, numberOfAttempts, 'numberOfAttempts')

                        // obtener del competidor solo los datos necesarios nombre y wcaid
                        const { name, wcaId } = competitor;
                        return {
                            numberOfAttempts,
                            timeCutoff,
                            timeLimit,
                            personId,
                            name,
                            wcaId,
                        };
                    }

                    );

                    return {
                        eventId: event.id,
                        roundId: round.id,
                        competitors: filteredResults,
                    };
                })
            );
            setRoundsData(newRoundsData);
        }
    }, [data]);





    if (isLoading) {
        return <Loader />;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'c6y2lary'); // Obtén esto desde Cloudinary

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
        const doc = <PDF
            imageUrl={imageUrl}
            competitors={competitors}
            tournamentName={data.name}
            category={eventId}
            totalGroups={2}
            round={2}
        />;

        const pdfBlob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `score-card-${eventId}-ronda-${roundId}.pdf`;
        link.click();
    };



    return (
        <div className="container mx-auto px-4 animate-fade-in animate-delay-200 animate-duration-slow">

            <h1 className="text-2xl font-bold mb-4">Score Card</h1>

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {
                loading ? (
                    <p>Procesando imagen...</p>
                ) : (
                    imageUrl && (
                        <>
                            {/* <img
                                src={imageUrl}
                                alt="Score Card"
                                className="w-full"
                            /> */}
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="w-full bg-gray-100 border-b border-gray-200">
                                        <th className="px-4 py-2 text-left">Evento</th>
                                        <th className="px-4 py-2 text-left">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roundsData.map(({ eventId, roundId, competitors }, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b border-gray-200">{eventId}</td>
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
                            </table>
                        </>
                    )
                )
            }

        </div>
    );

};

export default ScoreCard;
