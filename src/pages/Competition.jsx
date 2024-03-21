import React, { useEffect } from 'react';
import jsonData from '../test/CubiTome.json';
import { useCompetition } from '../queries/competitions';
import { useLocation, Link } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import { useTranslation } from 'react-i18next';

function Competion() {

    const { t } = useTranslation('global');

    const [countPersons, setCountPersons] = React.useState(0);
    const [events, setEvents] = React.useState([]);
    const [competitorsByEvent, setCompetitorsByEvent] = React.useState({});
    const [groupsByEvent, setGroupsByEvent] = React.useState([]);
    const [averageByEvent, setAverageByEvent] = React.useState([]);
    const [xd, setXd] = React.useState('');


    const location = useLocation();
    const { competition_id } = location.state;
    const { data, isLoading } = useCompetition(competition_id);

    useEffect(() => {
        if (!isLoading && data) {
            const eventIds = data.events.map((event) => event.id);
            setEvents(eventIds);

            // Filtrar los competidores que estan aceptados
            const persons = data.persons.filter((person) => person.registration.status === 'accepted');
            setCountPersons(persons.length);
            // Contar la cantidad de competidores por evento
            const competitorsCountByEvent = {};
            persons.forEach((competitor) => {
                competitor.registration.eventIds.forEach((eventId) => {
                    competitorsCountByEvent[eventId] = (competitorsCountByEvent[eventId] || 0) + 1;
                });
            });
            setCompetitorsByEvent(competitorsCountByEvent);

            // Inicializar la cantidad de grupos por evento
            const groupsByEvent = {};
            eventIds.forEach((eventId) => {
                groupsByEvent[eventId] = 2;
            });

            setGroupsByEvent(groupsByEvent);

        }
    }, [isLoading, data]);



    useEffect(() => {
        const updatedAverageByEvent = {};
        events.forEach((eventId) => {
            const competitorsCount = competitorsByEvent[eventId] || 0;
            const groupsCount = groupsByEvent[eventId] || 2;
            updatedAverageByEvent[eventId] = Math.round(competitorsCount / groupsCount);
        });
        setAverageByEvent(updatedAverageByEvent);
    }, [competitorsByEvent, groupsByEvent]);




    const handleGroupsChange = (eventId, e) => {
        e.preventDefault();
        const value = parseInt(e.target.value, 10);
        setGroupsByEvent({
            ...groupsByEvent,
            [eventId]: value,
        });

        // Recalcular el promedio solo para el evento específico que está cambiando
        const updatedAverageByEvent = {
            ...averageByEvent,
            [eventId]: Math.round(competitorsByEvent[eventId] / value),
        };

        setAverageByEvent(updatedAverageByEvent);
    };

    const returnToCompetitions = () => {
        window.location = '/competitions';
    }

    const generateGroup = () => {

        setXd('Generando Grupos...');

        setTimeout(() => {
            setXd('Ya no se que poner aqui, pero ya se generaron los grupos :v');
        }, 2000);

    }


    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => returnToCompetitions()}>
                {t("back")}
            </button>
            <h1 className="text-2xl font-bold mb-4 mt-4">{data ? data.name : "Loading..."}</h1>
            <div className="flex justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2">{t("events")}</h2>
                    <p>{events.length}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">{t("competitors")}</h2>
                    <p>{countPersons}</p>
                </div>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-800">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">{t("categories")}</th>
                        {events.map(eventId => (
                            <th key={`${eventId}_event`} className="px-4 py-2 border border-gray-800">{eventId}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">{t("categories")}</td>
                        {events.map(eventId => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">{competitorsByEvent[eventId] || 0}</td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">{t("groups-per-round")}</td>
                        {events.map(eventId => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">
                                <input
                                    type="number"
                                    className="w-full px-2 py-1"
                                    value={groupsByEvent[eventId]}
                                    min={1}
                                    onChange={e => handleGroupsChange(eventId, e)}
                                />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">{t("competitors-average")}</td>
                        {events.map(eventId => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">{averageByEvent[eventId] || 0}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-4 w-full" onClick={() => generateGroup()}>
                {t("generate-groups")}
            </button>
            <div className='text-xl mt-5'>
                {xd}
            </div>
        </div>
    );
}

export default Competion;