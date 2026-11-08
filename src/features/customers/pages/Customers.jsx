import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../common/queryClient";
import Modal from "@/common/components/Modal";
import CustomerForm from "../components/CustomerForm";

import { customerQuery } from "../queries";
import { useState, useEffect } from "react";

import CustomerCard from "../components/CustomerCard";

import CustomerHeaderSection from "../components/CustomerHeaderSection";
import { redirect } from "react-router";

function Customers() {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDescending, setIsDescending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const query = useQuery(customerQuery);

  const vw = document.documentElement.clientWidth;
  console.log(window.innerWidth, vw, document.documentElement.scrollWidth);
  [...document.querySelectorAll("*")]
    .filter((el) => el.getBoundingClientRect().right > vw)
    .forEach((el) =>
      console.log(el, Math.round(el.getBoundingClientRect().right)),
    );


  useEffect(() => {
    editingCustomer
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [editingCustomer]);

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
  if (sortBy !== "vehicleCount") {
    if (isDescending) {
      sortedQueryData = [...searchedQueryData].sort((a, b) =>
        b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase()),
      );
    } else {
      sortedQueryData = [...searchedQueryData].sort((a, b) =>
        a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()),
      );
    }
  } else {
    if (isDescending) {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => b.vehicleDtos.length - a.vehicleDtos.length,
      );
    } else {
      sortedQueryData = [...searchedQueryData].sort(
        (a, b) => a.vehicleDtos.length - b.vehicleDtos.length,
      );
    }
  }

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }


  return (
    <div className={`grid gap-2`}>
      <CustomerHeaderSection
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
        isDescending={isDescending}
        setIsDescending={setIsDescending}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCreateClick={() => setEditingCustomer({})}
      />

      <div className="  p-2 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
        {sortedQueryData.map((c) => (
          <CustomerCard
            onEditClick={() => setEditingCustomer(c)}
            key={c.customerId}
            customer={c}
          />
        ))}
      </div>
      {editingCustomer !== null && (
        <Modal setIsPortalOpen={() => setEditingCustomer(null)}>
          <CustomerForm
            customerToBeEdited={editingCustomer}
            setIsPortalOpen={() => setEditingCustomer(null)}
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
  return queryClient.query(customerQuery);
}

export default Customers;
