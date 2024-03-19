import React from 'react';
import jsonData from '../test/CubiTome.json'; // Importa el archivo JSON

function Competion() {

    const [events, setEvents] = React.useState([]);
    const [competitorsByEvent, setCompetitorsByEvent] = React.useState({});
    const [groupsByEvent, setGroupsByEvent] = React.useState([]);
    const [averageByEvent, setAverageByEvent] = React.useState([]);



    React.useEffect(() => {
        // Obtener la lista de eventos
        const eventIds = jsonData.events.map((event) => event.id);
        setEvents(eventIds);

        // Contar la cantidad de competidores por evento
        // Filtrar los competidores que estan aceptados

        const persons = jsonData.persons.filter((person) => person.registration.status === 'accepted');

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

        const averageByEvent = {};
        eventIds.forEach((eventId) => {
            averageByEvent[eventId] = (Math.round(competitorsByEvent[eventId] / groupsByEvent[eventId]) * 10) / 10;
        });

        setAverageByEvent(averageByEvent);



    }, []);

    console.log(events);
    console.log(competitorsByEvent)

    const handleGroupsChange = (eventId, e) => {
        e.preventDefault()
        const value = parseInt(e.target.value, 10);
        setGroupsByEvent({
            ...groupsByEvent,
            [eventId]: value,
        });

        const averageByEvent = {};
        events.forEach((eventId) => {
            averageByEvent[eventId] = (Math.round(competitorsByEvent[eventId] / groupsByEvent[eventId]) * 10) / 10;
        });

        setAverageByEvent(averageByEvent);
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{jsonData.name}</h1>
            <table className="table-auto w-full border-collapse border border-gray-800">
                <thead>

                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Categorias</th>
                        {events.map((eventId) => (
                            <th key={`${eventId}_event`} className="px-4 py-2 border border-gray-800">{eventId}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">Competidores</td>
                        {events.map((eventId) => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">{competitorsByEvent[eventId] || 0}</td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">Grupos por Ronda</td>
                        {events.map((eventId) => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">
                                <input
                                    type="number"
                                    className="w-full px-2 py-1"
                                    value={groupsByEvent[eventId]}
                                    min={1}
                                    onChange={(e) => handleGroupsChange(eventId, e)}
                                />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold border border-gray-800">Cantidad por Grupo</td>
                        {events.map((eventId) => (
                            <td key={eventId} className="px-4 py-2 border border-gray-800">{averageByEvent[eventId] || 0}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Competion;