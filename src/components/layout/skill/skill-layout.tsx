"use client"

import { CreateSkillForm } from '@/components/forms/skill/create-skill-form';
import { SkillCard } from '@/components/cards/skill/skill-card'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getAccessToken } from '@/actions/auth/auth-action';
import { getSkills } from '@/data/repository/skill-repository';
import { ResponseSkills, Skill } from '@/types/skill';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const pageSize = 5; // Default number of items per page

function SkillLayout() {
  const [skills, setSkills] = useState<ResponseSkills | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  const currentPage = Number(searchParams.get('page')) || 1;
  let currentSize = Number(searchParams.get('size')) || pageSize;

  const fetchSkills = async (offset: number, size: number) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data: ResponseSkills = await getSkills(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills(Number(currentPage), Number(currentSize),);
  }, [currentPage, currentSize, sortBy, sortOrder]);

  const handlePageChange = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  }

  return (
    <div>
      <CreateSkillForm />

      <p>Showed {currentSize} data per page</p>
      <div className='mt-5 grid max-w-7xl grid-cols-1 gap-4 pb-4 sm:grid-cols-2 md:pb-8 lg:grid-cols-3 lg:pb-10'>
        {
          skills?.data?.map((row: Skill) => {
            return <SkillCard
              key={row.id}
              row={row}
            />
          })
        }
      </div>

      {skills?.meta?.total_pages && skills?.meta.total_pages > 1 &&
        <Pagination>
          <PaginationContent>
            {
              currentPage - 1 > 0 && <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(String(currentPage - 1))}
                />
              </PaginationItem>
            }
            {
              skills?.meta.total_pages >= currentPage + 1 && <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(String(currentPage + 1))}
                />
              </PaginationItem>
            }
          </PaginationContent>
        </Pagination>
      }

    </div>
  )
}

export default SkillLayout
