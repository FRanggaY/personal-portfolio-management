"use client"

import { CreateSkillForm } from '@/components/forms/skill/create-skill-form';
import { SkillCard } from '@/components/cards/skill/skill-card'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getAccessToken } from '@/actions/auth/auth-action';
import { getSkills } from '@/data/repository/skill-repository';
import { ResponseSkills, Skill } from '@/types/skill';


const pageSizeOptions = [3, 5, 10]; // Options for items per page
const pageSize = 5; // Default number of items per page

function SkillLayout() {
  const [skills, setSkills] = useState<ResponseSkills | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentFilter = searchParams.get('filter') ?? '';
  let currentSize = Number(searchParams.get('size')) || pageSize;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async (offset: number, size: number) => {
    setLoading(true);
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
    } finally {
      // reset
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(Number(currentPage), Number(currentSize),);
  }, [currentPage, currentSize, sortBy, sortOrder]);

  return (
    <div>
      <CreateSkillForm />

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
    </div>
  )
}

export default SkillLayout
