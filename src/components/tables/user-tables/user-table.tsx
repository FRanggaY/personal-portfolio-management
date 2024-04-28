"use client"

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter, useSearchParams } from 'next/navigation';

const pageSizeOptions = [3, 5, 10]; // Options for items per page
const pageSize = 3; // Default number of items per page
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]


export function TableDemo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSortField = searchParams.get('sort') || 'invoice'; // Default sort field
  const currentSortOrder = searchParams.get('order') || 'asc'; // Default sort order
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentFilter = searchParams.get('filter') || '';
  let currentSize = Number(searchParams.get('size')) || pageSize;
  const [totalPages, setTotalPages] = useState(1);
  const [displayedInvoices, setDisplayedInvoices] = useState([]);

  // put default to base limit if that outside range
  let parsedLimit = Number(currentSize);
  if (isNaN(parsedLimit) || !pageSizeOptions.includes(parsedLimit)) {
    currentSize = pageSizeOptions[0];
  }

  // Simulated function to fetch data from the server
  const fetchInvoicesFromServer = async (page, size, sortField, sortOrder, filter) => {
    // Simulated server-side filtering
    let filteredInvoices = [...invoices];
    if (filter) {
      filteredInvoices = filteredInvoices.filter(invoice => {
        return Object.values(invoice).some(value => {
          if (typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase())) {
            return true;
          }
          return false;
        });
      });
    }

    // Simulated server-side sorting
    filteredInvoices.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] < b[sortField] ? -1 : 1;
      } else {
        return a[sortField] > b[sortField] ? -1 : 1;
      }
    });

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const slicedInvoices = filteredInvoices.slice(startIndex, endIndex);

    return {
      invoices: slicedInvoices,
      totalCount: invoices.length,
    };
  };


  useEffect(() => {
    const fetchData = async () => {
      const { invoices: fetchedInvoices, totalCount } = await fetchInvoicesFromServer(
        currentPage,
        currentSize,
        currentSortField,
        currentSortOrder,
        currentFilter
      );
      setDisplayedInvoices(fetchedInvoices);
      setTotalPages(Math.ceil(totalCount / currentSize));
    };

    fetchData();
  }, [currentPage, currentSize, currentSortField, currentSortOrder, currentFilter]);


  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  const handleSizeChange = (size) => {
    const params = new URLSearchParams(searchParams);
    params.set("size", size.toString());
    params.set("page", "1"); // Reset page to 1 when changing page size
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  const handleSortChange = (field) => {
    const params = new URLSearchParams(searchParams);
    const sortOrder = currentSortField === field && currentSortOrder === 'asc' ? 'desc' : 'asc';
    params.set("sort", field);
    params.set("order", sortOrder);
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  const handleFilterChange = (filterValue) => {
    const params = new URLSearchParams(searchParams);
    if (filterValue.trim() !== '') {
      params.set("filter", filterValue);
    } else {
      params.delete("filter"); // Remove filter parameter if the value is blank
    }
    params.set("page", "1"); // Reset page to 1 when changing filter
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={currentFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]" onClick={() => handleSortChange('invoice')}>Invoice</TableHead>
            <TableHead onClick={() => handleSortChange('paymentStatus')}>Status</TableHead>
            <TableHead onClick={() => handleSortChange('paymentMethod')}>Method</TableHead>
            <TableHead className="text-right" onClick={() => handleSortChange('totalAmount')}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedInvoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div>
        <span>Show: </span>
        {pageSizeOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleSizeChange(option)}
            className={option === currentSize ? 'active' : ''}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}
