import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAvatarZip } from "../../queries/images";
import { useGenerateScoreSheet } from "../../queries/groups";
import { SortIcon } from "../../Icons/Icons";

const PersonTable = ({ wcif, events, groupsByEvent }) => {
  const [editedGroups, setEditedGroups] = useState({});
  const [showWcaId, setShowWcaId] = useState(true);
  const [languageScoreCard, setLanguageScoreCard] = useState("es");
  const [filterName, setFilterName] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [urlZip, setUrlZip] = useState("");
  const [urlScoreCard, setUrlScoreCard] = useState("");
  const [urlEmptyScoreCard, setUrlEmptyScoreCard] = useState("");
  const [urlGroupsPDF, setUrlGroupsPDF] = useState("");
  const [urlGroupCSV, setUrlGroupCSV] = useState("");
  const [image, setImage] = useState(null);

  const mutateGenerateScoreCard = useGenerateScoreSheet();
  const mutateAvatarZip = useAvatarZip();

  const { t } = useTranslation("global");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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
    setUrlEmptyScoreCard("");
    setUrlScoreCard("");
    setUrlGroupsPDF("");
    setUrlGroupCSV("");

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
    formData.append("image", image);

    // llamamos a papi
    const response = await mutateGenerateScoreCard.mutateAsync(formData);
    setUrlEmptyScoreCard(response.emptyScoreCard);
    setUrlScoreCard(response.scoreCard);
    setUrlGroupsPDF(response.groupsPDF);
    setUrlGroupCSV(response.groupsCSV);
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

        <div>
          {/* Boton para descargar las imagenes  */}
          <button
            className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
            onClick={() => downloadImages()}
          >
            {t("obtain-images-competitors")}
          </button>

          {urlZip && (
            <a
              href={urlZip}
              download="avatars.zip"
              className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 ml-2"
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
                    className="text-red-400"
                    target="_blank"
                  >
                    {`${person.wcaId ? person.wcaId : "-"}`}
                  </a>
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-2 font-medium text-gray-900 ${
                    person.wcaId ? "" : "text-green-500/70"
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
                      className={`w-16 p-2 rounded border ${
                        getEventGroup(person, event) === ""
                          ? "border-dotted border-red-300"
                          : "border"
                      } ${
                        groupsByEvent[event.id] < getEventGroup(person, event)
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
        <div className="">
          <input
            type="file"
            onChange={handleImageChange}
            accept=".png"
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
          >
            {t("select-image")}
          </label>
        </div>
        <button
          onClick={generateScoreCard}
          className="py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          {t("generate-scoreCard")}
        </button>
      </div>

      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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
    </div>
  );
};

export default PersonTable;
