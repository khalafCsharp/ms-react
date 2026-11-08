import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../common/queryClient";
import Modal from "@/common/components/Modal";

import { servicesQuery } from "../queries";
import { useState, useEffect } from "react";

import ServiceForm from "../components/ServiceForm";
import ServicesHeaderSection from "../components/ServicesHeaderSection";
import { redirect } from "react-router";
import ServiceCard from "../components/ServiceCard";

function Services() {
  const [editingService, setEditingService] = useState(null);
  const [isDescending, setIsDescending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const query = useQuery(servicesQuery);
  
  useEffect(() => {
    editingService
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [editingService]);

  if (query.isLoading) {
    return <p>...Loading</p>;
  }
  if (query.error) {
    return <p>...error</p>;
  }

  const searchedQueryData = query.data.filter((c) =>
    c.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
  );

  let sortedQueryData;

  //  sortBy === "name";
  if (Object.is(sortBy, "name")) {
    if (isDescending) {
      sortedQueryData = [...searchedQueryData].sort((a, b) =>
        b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase()),
      );
    } else {
      sortedQueryData = [...searchedQueryData].sort((a, b) =>
        a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()),
      );
    }
  } else if (Object.is(sortBy, "partsCount")) {
    if (isDescending) {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => b.repairTaskParts.length - a.repairTaskParts.length,
      );
    } else {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => a.repairTaskParts.length - b.repairTaskParts.length,
      );
    }
  } else {
    if (isDescending) {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => b[sortBy] - a[sortBy],
      );
    } else {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => a[sortBy] - b[sortBy],
      );
    }
  }

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }
  return (
    <div className={`grid gap-2 `}>
      <ServicesHeaderSection
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
        isDescending={isDescending}
        setIsDescending={setIsDescending}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCreateClick={() => setEditingService({})}
      />

      <div className="   p-2 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
        {sortedQueryData.map((s) => (
          <ServiceCard
            onEditClick={() => setEditingService(s)}
            key={s.repairTaskId}
            task={s}
          />
        ))}
      </div>
      {editingService !== null && (
        <Modal setIsPortalOpen={() => setEditingService(null)}>
          <ServiceForm
            serviceToBeEdited={editingService}
            setIsPortalOpen={() => setEditingService(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function loader() {
  if (!localStorage.getItem("auth")) {
    throw redirect("/login");
  }
  return queryClient.query(servicesQuery);
}

export default Services;
