"use client"

import StatisticsView from '@/components/worklog/StatisticsView'
import { User, TaskHourTableItem } from '@/types/Model'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {SearchInterface} from '@/components/worklog/SearchInterface'
import moment from 'moment';


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [workItems, setWorkItems] = useState<TaskHourTableItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TaskHourTableItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get user role once when component mounts
    const role = localStorage.getItem('user_role');
    setIsAdmin(role === 'Scrum Master');
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (isAdmin === null) return; // Wait until role is determined
    
    const fetchTaskHours = async () => {
      try {
        const userId = !isAdmin ? localStorage.getItem('user_id') : null;
        const url = userId ? `/api/product/taskhours?user_id=${userId}` : '/api/product/taskhours';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch task hours');
        }
        const data = await response.json();
        setWorkItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching task hours:', error);
      }
    };

    fetchTaskHours();
  }, [isAdmin]);

  const handleSearch = (params: URLSearchParams) => {
    const user_id = params.get('user_id');
    let start_date = params.get('start_date');
    let end_date = params.get('end_date');

    const filtered = workItems.filter(item => {
      const itemDate = moment(item.create_time);
      
      return (!user_id || item.user_id === user_id) &&
             (!start_date || itemDate.isSameOrAfter(moment(start_date))) &&
             (!end_date || itemDate.isSameOrBefore(moment(end_date)));
    });
    
    setFilteredItems(filtered);
  }

  const handleExport = () => {
    const csv = [
      ['Date', 'Product', 'User Story', 'Task', 'Hours', 'Note', 'User ID'],
      ...filteredItems.map(item => [
        item.create_time,
        item.product,
        item.user_story,
        item.task,
        item.hours,
        item.note,
        item.user_id
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'work_statistics.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">团队工时统计</h1>
      <div className="space-y-6">
        <SearchInterface 
          isAdmin={isAdmin} 
          users={users} 
          onSearch={handleSearch} 
          onExport={handleExport}
        />
        <StatisticsView workItems={filteredItems} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
