import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAvatarZip } from "../../queries/images";
import { useGenerateScoreSheet } from "../../queries/groups";
import { CheckIcon, ClearIcon, SortIcon } from "../../Icons/Icons";
import Loader from "../Loader/Loader";
import { useSaveWcif } from "../../queries/competitions";

const PersonTable = ({ wcif, events, groupsByEvent }) => {
    const [editedGroups, setEditedGroups] = useState({});
    const [showWcaId, setShowWcaId] = useState(true);
    const [languageScoreCard, setLanguageScoreCard] = useState("es");
    const [filterName, setFilterName] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });
    const [urlZip, setUrlZip] = useState(null);
    const [urlScoreCard, setUrlScoreCard] = useState("");
    const [urlEmptyScoreCard, setUrlEmptyScoreCard] = useState("");
    const [urlGroupsPDF, setUrlGroupsPDF] = useState("");
    const [urlGroupCSV, setUrlGroupCSV] = useState("");
    const [namePDF, setNamePDF] = useState("");
    const [image, setImage] = useState(null);
    const [loadingScoreCards, setLoadingScoreCards] = React.useState(false);

    const mutateSaveWcif = useSaveWcif();

    const mutateGenerateScoreCard = useGenerateScoreSheet();
    const mutateAvatarZip = useAvatarZip();

    const { t } = useTranslation("global");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        console.log(file)
    };

    const handleInputChange = (personName, eventId, value) => {
        // let intValue = parseInt(value);

        if (value === "") {
            value = undefined;
        }
        if (value < 1) {
            value = 1;
        }

        if (value > groupsByEvent[eventId]) {
            value = groupsByEvent[eventId];
        }

        setEditedGroups((prevState) => ({
            ...prevState,
            [`${personName}-${eventId}`]: value,
        }));
        updateWCIF(personName, eventId, value);
    };

    const updateWCIF = (personName, eventId, value) => {
        const intValue = parseInt(value);
        // validar que el valor sea menor o igual a la cantidad de grupos por evento

        if (intValue > groupsByEvent[eventId]) {
            return;
        }

        const updatedPersons = wcif.persons.map((person) => {
            if (person.name === personName) {
                return {
                    ...person,
                    [eventId]: intValue,
                };
            }
            return person;
        });
        wcif.persons = updatedPersons;
    };

    const getEventGroup = (person, event) => {
        const key = `${person.name}-${event.id}`;
        return editedGroups[key] !== undefined
            ? editedGroups[key]
            : person[event.id] || "";
    };

    const sortBy = (key) => {
        console.log(key);
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const worldRankingOfPersonInEvent = (person, eventId) => {
        const personalBests = person.personalBests || [];
        if (!personalBests || !personalBests.some((pb) => pb.eventId === eventId)) {
            return 10 ** 9;
        }
        return Math.min(
            ...personalBests
                .filter((pb) => pb.eventId === eventId)
                .map((pb) => pb.worldRanking || 10 ** 9)
        );
    };

    const sortedPersons = [...wcif.persons]
        .filter((person) =>
            person.name.toLowerCase().includes(filterName.toLowerCase())
        )
        .sort((a, b) => {
            if (sortConfig.key === "name") {
                return sortConfig.direction === "ascending"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            if (sortConfig.key === "age") {
                return sortConfig.direction === "ascending"
                    ? a.age - b.age
                    : b.age - a.age;
            }
            // Sorting by world ranking in the specified event
            if (events.find((event) => event.id === sortConfig.key)) {
                const eventId = sortConfig.key;
                const worldRankingA = worldRankingOfPersonInEvent(a, eventId);
                const worldRankingB = worldRankingOfPersonInEvent(b, eventId);
                return sortConfig.direction === "ascending"
                    ? worldRankingA - worldRankingB
                    : worldRankingB - worldRankingA;
            }
            // Default sorting by name if no valid key is provided
            return a.name.localeCompare(b.name);
        });

    // const competitorsPerEvent = events.reduce((acc, event) => {
    //     acc[event.id] = wcif.persons.filter(person => person[event.id] !== undefined).length;
    //     return acc;
    // }, {});

    const generateScoreCard = async () => {
        patchWCIF();
        // quitar esto
        return;
        setLoadingScoreCards(true);
        setUrlEmptyScoreCard("");
        setUrlScoreCard("");
        setUrlGroupsPDF("");
        setUrlGroupCSV("");
        setNamePDF("");

        wcif.lang = languageScoreCard;

        wcif.groups = groupsByEvent;
        wcif.addWcaId = showWcaId;
        // wcif.image = image;
        wcif.groups = Object.keys(wcif.groups).reduce((acc, key) => {
            if (key !== "criteria") {
                acc[key] = wcif.groups[key];
            }
            return acc;
        }, {});

        const formData = new FormData();
        formData.append("wcif", JSON.stringify(wcif));
        if (image) {
            formData.append("image", image);
        }

        const response = await mutateGenerateScoreCard.mutateAsync(formData);
        setUrlEmptyScoreCard(response.emptyScoreCard);
        setUrlScoreCard(response.scoreCard);
        setUrlGroupsPDF(response.groupsPDF);
        setUrlGroupCSV(response.groupsCSV);
        setNamePDF(response.namesPDF);
        setLoadingScoreCards(false);
    };

    const downloadImages = async () => {
        setUrlZip("");

        const avatars = wcif.persons
            .filter(
                (person) =>
                    person.avatar && !person.avatar.url.includes("missing_avatar_thumb")
            )
            .map((person) => {
                return {
                    name: person.name,
                    url: person.avatar.url,
                    registrantId: person.registrantId,
                };
            });
        avatars.push({
            name: wcif.id,
        });

        const response = await mutateAvatarZip.mutateAsync({ avatars: avatars });

        setUrlZip(response.url);
    };

    const resetAssignmentsWCIF = () => {
        wcif.persons.forEach((person) => {
            person.assignments = [];
        });
    };

    const createAssignmentForPerson = (person,activityCode, assignmentCode) => {
        person.assignments.push({
            activityId: activityCode,
            assignmentCode: assignmentCode,
        });
    }

    const createAssignmentInWCIF = () => {

        resetAssignmentsWCIF(wcif);

        for (const venue of wcif.schedule.venues) {
            for (const room of venue.rooms) {
                for (const activity of room.activities) {
                    for (const childActivity of activity.childActivities.filter(a => a.activityCode.includes('-r1-g'))) {

                        console.log(childActivity)
                        const eventId = childActivity.activityCode.split('-')[0];
                        // obtener los competidores que dentro de sus propiedades tenga el eventId
                        const competitors = wcif.persons.filter(person => person[eventId] !== undefined && person[eventId] === parseInt(childActivity.activityCode.split('-r1-g')[1]));

                        competitors.forEach(competitor => {
                            createAssignmentForPerson(competitor, childActivity.id, 'competitor')
                        });
                    }
                }
            }
        }
    };

    const patchWCIF = () => {
        createAssignmentInWCIF(wcif)

        const persons = wcif.persons.map(p => (
            {
                assignments: p.assignments,
                name: p.name,
                registrantId: p.registrantId,
                wcaId: p.wcaId,
                wcaUserId: p.wcaUserId
            })
        )

        const wcifToSend = {
            id: wcif.id,
            schedule: wcif.schedule,
            persons: persons
        }

        // mutateSaveWcif.mutate(wcif);
        mutateSaveWcif.mutate(wcifToSend);

        return;
        // recorrer persona por persona y agregar un array assignaments
        // agregar un array de assignaments a cada persona
        // agregar un array de assignaments a cada persona

        const updatedPersons = wcif.persons.map((person) => {
            const assignments = [];
            events.forEach((event) => {
                // obtener el grupo de la persona en el evento y si no tiene se pasa al siguiente
                const group = person[event.id];
                if (!group) {
                    return;
                }
                // Obtener en schedule venues rooms en la posicion 0 , y en activitiee buscar en la key activityCode event.id-r1
                const activityCode = `${event.id}-r1`;
                const activity = wcif.schedule.venues[0].rooms[0].activities.find(
                    (activity) => activity.activityCode === activityCode
                );
                if (!activity) {
                    return;
                }
                // buscar dentro del activity el child activitiees y buscar el group
                const childactivity = `${event.id}-r1-g${group}`;
                const childActivity = activity.childActivities.find(
                    (childActivity) => childActivity.activityCode === childactivity
                );
                if (!childActivity) {
                    return;
                }

                // agregar el assignament
                assignments.push({
                    activityId: childActivity.id,
                    assignmentCode: "competitor",
                });
            });
            return {
                ...person,
                assignments: assignments,
            };
        }

        );
        wcif.persons = updatedPersons;

        mutateSaveWcif.mutate(wcif);
    };


    if (loadingScoreCards) {
        return <Loader />;
    }

    return (
        <div className="mt-5 bg-white p-4 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">{t("results")}</h2>
            <div className="grid md:flex md:flex-wrap items-center gap-4 justify-between w-full">
                <div className="grid md:flex items-center gap-1">
                    <label>{t("filter-by-name")}</label>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300"
                        checked={showWcaId}
                        onChange={() => setShowWcaId(!showWcaId)}
                    />
                    <label>{t("show-wca-id")}</label>
                </div>
                <div className="flex items-center gap-1">
                    <label>{t("select-language")}</label>
                    <select
                        className="px-2 py-1 border rounded"
                        value={languageScoreCard}
                        onChange={(e) => setLanguageScoreCard(e.target.value)}
                    >
                        <option value="en">{t("lang-en")}</option>
                        <option value="es">{t("lang-es")}</option>
                    </select>
                </div>

                <div className="">
                    {/* Boton para descargar las imagenes  */}
                    <button
                        className={`py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold inline-block min-w-min ${urlZip === "" ? "cursor-not-allowed bg-green-500/80" : "hover:bg-blue-600"}`}
                        onClick={() => downloadImages()}
                    >
                        {urlZip === "" ? t("download-process") : t("obtain-images-competitors")}
                    </button>

                    {urlZip && (
                        <a
                            href={urlZip}
                            download="avatars.zip"
                            className="mt-3 py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 sm:ml-2 inline-block min-w-min"
                        >
                            {t("download-zip")}
                        </a>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto h-80 rounded-lg border border-gray-200 mt-4">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="text-left">
                        <tr>
                            <th
                                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                onClick={() => sortBy("wcaId")}
                            >
                                WCA ID
                            </th>
                            <th
                                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                onClick={() => sortBy("name")}
                            >
                                <div className="flex cursor-pointer items-center">
                                    {t("name")}
                                    <span className="">
                                        <SortIcon className="h-4 w-4 " />
                                    </span>
                                </div>
                            </th>
                            <th
                                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                onClick={() => sortBy("age")}
                            >
                                <div className="flex cursor-pointer items-center">
                                    {t("age")}
                                    <span className="">
                                        <SortIcon className="h-4 w-4 " />
                                    </span>
                                </div>
                            </th>
                            {events.map((event) => (
                                <th
                                    key={event.id}
                                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                    onClick={() => sortBy(event.id)}
                                >
                                    <div className="flex cursor-pointer items-center">
                                        {event.id}
                                        <span className="">
                                            <SortIcon className="h-4 w-4 " />
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {sortedPersons.map((person, index) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <a
                                        href={`https://www.worldcubeassociation.org/persons/${person.wcaId}`}
                                        className="text-red-400 hover:text-xl"
                                        target="_blank"
                                    >
                                        {`${person.wcaId ? person.wcaId : ""}`}
                                    </a>
                                </td>
                                <td
                                    className={`whitespace-nowrap px-4 py-2 font-medium text-gray-900 ${person.wcaId ? "" : "text-green-500/70"
                                        }`}
                                >
                                    {person.name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    {person.age}
                                </td>
                                {events.map((event) => (
                                    <td
                                        key={`${person.registrantId}-${event.id}`}
                                        className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                    >
                                        <input
                                            type="number"
                                            className={`w-16 p-2 rounded border ${getEventGroup(person, event) === ""
                                                ? "border-dotted border-red-300"
                                                : "border"
                                                } ${groupsByEvent[event.id] < getEventGroup(person, event)
                                                    ? "border-red-500"
                                                    : ""
                                                }`}
                                            value={getEventGroup(person, event)}
                                            onChange={(e) =>
                                                handleInputChange(person.name, event.id, e.target.value)
                                            }
                                            min={1}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "e" ||
                                                    e.key === "," ||
                                                    e.key === "E" ||
                                                    e.key === "." ||
                                                    e.key === "-" ||
                                                    e.key === "+"
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 grid md:flex gap-4 justify-end items-center">
                <div className="flex">
                    <input
                        type="file"
                        onChange={handleImageChange}
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
                    {image && (
                        <div className="flex flex-col items-center">
                            <button
                                className="cursor-pointer text-red-500 mt-2"
                                onClick={() => setImage(null)}
                            >
                                <ClearIcon />
                            </button>
                        </div>
                    )}

                </div>
                <button
                    onClick={generateScoreCard}
                    className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                    {t("generate-scoreCard")}
                </button>

            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4 ">
                <div>
                    {urlScoreCard && (
                        <a
                            href={urlScoreCard}
                            download="scoreCard.pdf"
                            className="block py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                        >
                            {t("download-scoreCard")}
                        </a>
                    )}
                </div>
                <div>
                    {urlEmptyScoreCard && (
                        <a
                            href={urlEmptyScoreCard}
                            download="empty-scoreCard.pdf"
                            className="block py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                        >
                            {t("download-empty-scoreCard")}
                        </a>
                    )}
                </div>
                <div>
                    {urlGroupsPDF && (
                        <a
                            href={urlGroupsPDF}
                            download="groups.pdf"
                            className="block py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                        >
                            {t("download-groups")}
                        </a>
                    )}
                </div>
                <div>
                    {urlGroupCSV && (
                        <a
                            href={urlGroupCSV}
                            download="groups.csv"
                            className="block py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                        >
                            {t("download-groups-csv")}
                        </a>
                    )}
                </div>
                <div>
                    {namePDF && (
                        <a
                            href={namePDF}
                            download="names.pdf"
                            className="block py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
                        >
                            {t("download-names")}
                        </a>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PersonTable;
