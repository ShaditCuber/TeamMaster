import React, { useState } from 'react';

const PersonTable = ({ persons, events }) => {

    const [editedGroups, setEditedGroups] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });


    const handleInputChange = (personName, eventId, value) => {
        setEditedGroups(prevState => ({
            ...prevState,
            [`${personName}-${eventId}`]: value
        }));
    }

    const getEventGroup = (person, event) => {
        const key = `${person.name}-${event.id}`;
        return editedGroups[key] !== undefined ? editedGroups[key] : (person[event.id] || '');
    }

    const sortBy = (key) => {
        console.log(key)
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    // def worldRankingOfPersonInEvent(person, eventId):
    // personalBests = person.get("personalBests", [])
    // if personalBests is None or not any(
    //     pb.get("eventId") == eventId for pb in personalBests
    // ):
    //     return 10 ** 9
    // return min(
    //     pb.get("worldRanking", 10 ** 9)
    //     for pb in personalBests
    //     if pb.get("eventId") == eventId
    //     )

    const worldRankingOfPersonInEvent = (person, eventId) => {
        const personalBests = person.personalBests || [];
        if (!personalBests || !personalBests.some(pb => pb.eventId === eventId)) {
            return 10 ** 9;
        }
        return Math.min(
            ...personalBests
                .filter(pb => pb.eventId === eventId)
                .map(pb => pb.worldRanking || 10 ** 9)
        );
    }



    const sortedPersons = [...persons].sort((a, b) => {
        if (sortConfig.key === 'name') {
            return sortConfig.direction === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortConfig.key === 'age') {
            return sortConfig.direction === 'ascending' ? a.age - b.age : b.age - a.age;
        }
        // Sorting by world ranking in the specified event
        if (events.find(event => event.id === sortConfig.key)) {
            const eventId = sortConfig.key;
            const worldRankingA = worldRankingOfPersonInEvent(a, eventId);
            const worldRankingB = worldRankingOfPersonInEvent(b, eventId);
            return sortConfig.direction === 'ascending' ? worldRankingA - worldRankingB : worldRankingB - worldRankingA;
        }
        // Default sorting by name if no valid key is provided
        return a.name.localeCompare(b.name);
    });


    return (
        <div className='overflow-x-auto mt-5'>
            <table className='min-w-full table-auto'>
                <thead>
                    <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('wcaId')}>WCA ID</th>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('name')}>Nombre</th>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('age')}>Edad</th>
                        {events.map(event => (
                            <th key={event.id} className='py-3 px-6 text-left' onClick={() => sortBy(event.id)}>{event.id}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className='text-gray-600 text-sm font-light'>
                    {sortedPersons.map((person, index) => (
                        <tr key={index} className='border-b border-gray-200 hover:bg-gray-100'>
                            <td className='py-3 px-6 text-left whitespace-nowrap'>
                                <a href={`https://www.worldcubeassociation.org/persons/${person.wcaId}`} className='text-red-400 hover:text-xl' target='_blank'>{person.wcaId}</a>
                            </td>
                            <td className='py-3 px-6 text-left whitespace-nowrap'>{person.name}</td>
                            <td className='py-3 px-6 text-left whitespace-nowrap'>{person.age}</td>
                            {events.map(event => (
                                <td key={`${person.name}-${event.id}`} className='py-3 px-6 text-left'>
                                    <input
                                        type="number"
                                        className={`w-16 p-2 rounded border ${getEventGroup(person, event) === '' ? 'border-dotted border-red-300' : 'border'}`}
                                        value={getEventGroup(person, event)}
                                        onChange={(e) => handleInputChange(person.name, event.id, e.target.value)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PersonTable;
