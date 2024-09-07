import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import { useCompetition, useCompetitions } from "../queries/competitions";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "../components/PDFS/PDF";
import { pdf } from "@react-pdf/renderer";
import { ClearIcon, SortIcon, SyncIcon, UploadIcon } from "../Icons/Icons";
import CubiKoronel from "../test/CubiKoronelComplete.json";
import { formatCentiseconds } from '@wca/helpers';


const ScoreCard = () => {

    // const [roundsData, setRoundsData] = useState([]);

    const [groupSplit, setGroupSplit] = useState(2);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const [t, i18n] = useTranslation("global");


    let competition_id;

    const location = useLocation();

    try {
        competition_id = location.state.competition_id;
    } catch (error) {
        window.location.href = "/scoreCard";
    }

    console.log(competition_id)


    const { data: wcif, isLoading , refetch } = useCompetition(competition_id);
    // const data = CubiKoronel;
    // const isLoading = false;

    const roundText = t("round")

    if (isLoading || loading) {
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


    const handleGroupSplit = (e) => {
        setLoading(true);
        setGroupSplit(parseInt(e.target.value));
        setLoading(false);
    }

    const handleSyncResult = async () => {
        setLoading(true); 
        try {
            await refetch();
        } catch (error) {
            console.error("Error al hacer refetch", error);
        } finally {
            setLoading(false);
        }
    }


    const getNameCompetitor = (personId) => {
        const competitor = wcif.persons.find(person => person.registrantId === personId);
        return {
            name: competitor.name,
            wcaId: competitor.wcaId,
            registrantId: competitor.registrantId,
        };
    }

    const printScoreCard = async ( eventId, eventName, round, groupSplit) => {
        const competitors = wcif.events.find(event => event.id === eventId).rounds[round].results;

        const competitorsData = competitors.map(({ personId }) => getNameCompetitor(personId));

        let timeLimit = wcif.events.find(event => event.id === eventId).rounds[round]?.timeLimit?.centiseconds;

        let timeCutoff = wcif.events.find(event => event.id === eventId).rounds[round]?.cutoff?.attemptResult;

        const numberOfAttempts = wcif.events.find(event => event.id === eventId).rounds[round]?.cutoff?.numberOfAttempts;

        if (timeLimit) {
            timeLimit = formatCentiseconds(timeLimit);
        }

        if (timeCutoff) {
            timeCutoff = formatCentiseconds(timeCutoff);
        }


        const totalCompetitors = competitorsData.length;

        const competitorsPerGroup = Math.ceil(totalCompetitors / groupSplit);

        const shuffledCompetitors = competitorsData.sort(() => Math.random() - 0.5);

        const groupedCompetitors = shuffledCompetitors.map((competitor, index) => ({
            ...competitor,
            groupNumber: Math.floor(index / competitorsPerGroup) + 1
        }));


        const doc = <PDF
            imageUrl={imageUrl}
            competitors={groupedCompetitors}
            tournamentName={wcif.name}
            category={eventId}
            categoryName={eventName}
            totalGroups={groupSplit}
            round={round + 1}
            i18n={i18n}
            timeLimit={timeLimit ? timeLimit : null}
            timeCutoff={timeCutoff ? timeCutoff : null}
            numberOfAttempts={numberOfAttempts ? numberOfAttempts : null}
        />;

        try {
            const pdfBlob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `scoreCard-${eventId}-${roundText}${round + 1}.pdf`;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }



    return (
        <div className="container mx-auto px-4 animate-fade-in animate-delay-200 animate-duration-slow">

            <h1 className="text-2xl font-bold mb-4">ScoreCard {wcif.name} ( {wcif.events.length} {t("events")} )</h1>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Selector de Imagen */}
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".png"
                        className="hidden"
                        id="imageInput"
                        onChange={handleImageUpload}
                    />
                    <label
                        htmlFor="imageInput"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors duration-300"
                        title={t("image-title")}
                    >
                        <div className="flex items-center gap-2">
                            <UploadIcon /> {t("select-image")}
                        </div>
                    </label>
                    {imageUrl && (
                        <button
                            className="cursor-pointer text-red-500"
                            onClick={() => setImageUrl(null)}
                            title={t("clear-image")}
                        >
                            <ClearIcon />
                        </button>
                    )}
                </div>

                {/* Input de Cantidad de Grupos */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="numberOfGroups" className="text-gray-700 text-sm font-bold">
                        {t("group-split")}
                    </label>
                    <input
                        defaultValue={2}
                        type="number"
                        id="numberOfGroups"
                        min={1}
                        step={1}
                        placeholder="Cantidad de grupos"
                        onChange={handleGroupSplit}
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-20 sm:w-24"
                    />
                </div>

                {/* Botón de Sincronizar */}
                <button
                    onClick={handleSyncResult}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors duration-300"
                >
                    <SyncIcon /> {t("sync")}
                </button>
            </div>



            {
                    <div className="overflow-x-auto pt-5">
                        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                            <tbody>
                                {wcif.events.map((event, eventIndex) => (
                                    <tr key={eventIndex} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 font-medium">{t(event.id)}</td>
                                        {/* <td>
                                            <button
                                                onClick={() => printScoreCard(data, event.id, 0, numberOfGroups)}
                                                disabled={event.rounds[0]?.results?.length === 0}
                                                className={`px-4 py-2 text-sm rounded-md transition bg-gray-300 text-gray-500 cursor-not-allowed`}
                                            >
                                                {roundText} {1}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => printScoreCard(data, event.id, 1, numberOfGroups)}
                                                disabled={event.rounds[1]?.results?.length === 0}
                                                className={`px-4 py-2 text-sm rounded-md transition bg-blue-500 text-white hover:bg-blue-600`}
                                            >
                                                {roundText} {2}
                                            </button>
                                        </td> */}

                                        {[...Array(4).keys()].map((roundIndex) => (
                                            <td key={roundIndex}>
                                                {event.rounds.length > roundIndex && (
                                                    <button
                                                        onClick={() => printScoreCard(event.id, t(event.id), roundIndex, groupSplit)}
                                                        disabled={event.rounds[roundIndex]?.results?.length === 0 || roundIndex === 0}
                                                        className={`px-4 py-2 text-sm rounded-md transition ${roundIndex === 0 || event.rounds[roundIndex]?.results?.length === 0
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        {roundText} {roundIndex + 1}
                                                    </button>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            }

        </div>
    );

};

export default ScoreCard;
