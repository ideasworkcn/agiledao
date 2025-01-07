'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useEffect } from 'react';
import { User } from '@/types/Model'
import { useToast } from "@/hooks/use-toast"



export default function ScrumTeamManagement() {
  const [members, setMembers] = useState<User[]>([ ])
  const {toast} = useToast();



  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "错误",
            description: (await response.json()).message,
          });
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);


  

  const [editingMember, setEditingMember] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false);


  const updateMember = async () => {
    if (editingMember) {
      try {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingMember),
        });

        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "错误",
            description: (await response.json()).message,
          });
          return;
        }

        const updatedMember = await response.json();
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
        setEditingMember(null);
        toast({
          title: "成功",
          description: "用户已成功更新",
        });

        // Close the dialog after successful update
        setShowModal(false);
      } catch (error) {
        console.error('Error updating user:', error);
        toast({
          variant: "destructive",
          title: "错误",
          description: "更新用户时出错",
        });
      }
    }
  }



  const [selectedRole, setSelectedRole] = useState('all')
  const filteredMembers = Array.isArray(members) ? members.filter(member => {
    const matchesSearchTerm = (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false

    const matchesRole = selectedRole === 'all' || member.role === selectedRole

    return matchesSearchTerm && matchesRole
  }) : [];

  const InviteMember = () => {
    const workspaceUrl = window.location.origin + '/workspace';
    const inviteMessage = `请访问以下链接注册并加入团队: ${workspaceUrl}`;
    navigator.clipboard.writeText(inviteMessage).then(() => {

      toast({
        title: "成功",
        description: "邀请链接已复制到剪贴板",
      });
    }).catch(err => {
      console.error('无法复制邀请链接', err);
    });
  }


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Scrum Team Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          <div className="flex space-x-4">
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Select
        value={selectedRole}
        onValueChange={(value) => setSelectedRole(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Scrum Master">Scrum Master</SelectItem>
          <SelectItem value="Product Owner">Product Owner</SelectItem>
          <SelectItem value="Developer">Developer</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={InviteMember}>Invite Member</Button>
    </div>
          
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={showModal} onOpenChange={setShowModal}>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => { setEditingMember(member); setShowModal(true); }}>Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Member</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={editingMember?.name||''}
                                  onChange={(e) => setEditingMember({ ...editingMember!, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  value={editingMember?.email||''}
                                  onChange={(e) => setEditingMember({ ...editingMember!, email: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="position" className="text-right">
                                  Position
                                </Label>
                                <Input
                                  id="position"
                                  value={editingMember?.position||''}
                                  onChange={(e) => setEditingMember({ ...editingMember!, position: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                  Role
                                </Label>
                                <Select
                                  value={editingMember?.role||''}
                                  onValueChange={(value) => setEditingMember({ ...editingMember!, role: value as "Team Member" | "Scrum Master" | "Product Owner" })}
                                >
                                  <SelectTrigger className=" col-span-3">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Team Member">Team Member</SelectItem>
                                    <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  Status
                                </Label>
                                <Select
                                  value={editingMember?.status || ''}
                                  onValueChange={(value) => setEditingMember({ ...editingMember!, status: value as "Active" | "Inactive" })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button onClick={updateMember}>Save Changes</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
