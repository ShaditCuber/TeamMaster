import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAvatarZip } from '../../queries/images';
import JSZip from 'jszip';

const PersonTable = ({ wcif, events }) => {

    const [editedGroups, setEditedGroups] = useState({});
    const [showWcaId, setShowWcaId] = useState(false);
    const [languageScoreSheet, setLanguageScoreSheet] = useState('en');
    const [filterName, setFilterName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });


    const mutateAvatarZip = useAvatarZip();

    const { t } = useTranslation('global');


    const handleInputChange = (personName, eventId, value) => {
        if (value === '') {
            value = undefined;
        }
        if (value < 1) {
            value = 1;
        }

        setEditedGroups(prevState => ({
            ...prevState,
            [`${personName}-${eventId}`]: value
        }));
        updateWCIF(personName, eventId, value);
    }

    const updateWCIF = (personName, eventId, value) => {
        const updatedPersons = wcif.persons.map(person => {
            if (person.name === personName) {
                return {
                    ...person,
                    [eventId]: value
                };
            }
            return person;
        });
        wcif.persons = updatedPersons;
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



    const sortedPersons = [...wcif.persons].filter(person =>
        person.name.toLowerCase().includes(filterName.toLowerCase())
    ).sort((a, b) => {
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

    const competitorsPerEvent = events.reduce((acc, event) => {
        acc[event.id] = wcif.persons.filter(person => person[event.id] !== undefined).length;
        return acc;
    }, {});

    const generateScoreSheet = () => {
        // xd
    }

    const downloadImages = async () => {
        // obtener las persons.avatar.url que no tengan missing_avatar_thumb y enviarlas al back , enviar , nombre, url y registrationId
        // const avatars = wcif.persons.filter(person => person.avatar && !person.avatar.url.includes('missing_avatar_thumb')).map(person => {
        //     return {
        //         "name": person.name,
        //         "url": person.avatar.url,
        //         "registrantId": person.registrantId
        //     }
        // })
        const avatars = wcif.persons.filter(person => person.avatar && !person.avatar.url.includes('missing_avatar_thumb'));
        const zip = new JSZip();

        await Promise.all(avatars.map(async (person) => {
            const response = await fetch(person.avatar.url, {
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
            });
            const blob = await response.blob();
            zip.file(`${person.registrantId}_${person.name.replace(/ /g, '_').toLowerCase()}.jpg`, blob);
        }));

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'avatars.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }


    return (
        <div className='overflow-x-auto mt-5'>
            <div className="flex flex-row gap-10 w-full">
                <div className='w-1/2'>
                    <label className="mr-2">{t("filter-by-name")}</label>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div className="w-1/2">
                    {/* Boton para descargar las imagenes  */}
                    <button className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 hidden" onClick={() => downloadImages()}>{t("download-images-competitors")}</button>
                </div>
            </div>
            <table className='min-w-full table-auto mt-4'>
                <thead>
                    <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('wcaId')}>WCA ID</th>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('name')}>{t("name")}</th>
                        <th className='py-3 px-6 text-left' onClick={() => sortBy('age')}>{t("age")}</th>
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
                                <td key={`${person.registrantId}-${event.id}`} className='py-3 px-6 text-left'>
                                    <input
                                        type="number"
                                        className={`w-16 p-2 rounded border ${getEventGroup(person, event) === '' ? 'border-dotted border-red-300' : 'border'}`}
                                        value={getEventGroup(person, event)}
                                        onChange={(e) => handleInputChange(person.name, event.id, e.target.value)}
                                        min={1}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='flex flex-row'>
                <div className="mt-4 w-1/3">
                    <input type="checkbox" checked={showWcaId} onChange={() => setShowWcaId(!showWcaId)} className="mr-2" />
                    <label>{t("show-wca-id")}</label>
                </div>
                <div className="mt-4 w-1/3">
                    <label>{t("select-language")}</label>
                    <select
                        className="px-2 py-1 border rounded"
                        value={languageScoreSheet}
                        onChange={(e) => setLanguageScoreSheet()}
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                <div className="mt-4 w-1/3 hidden">
                    <button onClick={generateScoreSheet} className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600">{t("generate-score-sheet")}</button>
                </div>
            </div>
        </div>
    );
}

export default PersonTable;
