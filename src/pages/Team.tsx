// ...existing code...
import { Users, Mail, Plus, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

export const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const mockTeamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: null,
      status: 'active',
      tasksCompleted: 24,
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      avatar: null,
      status: 'active',
      tasksCompleted: 18,
      joinDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      avatar: null,
      status: 'inactive',
      tasksCompleted: 12,
      joinDate: '2024-01-10'
    },
  ];
  
  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            Team
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your team members and permissions</p>
        </div>
        <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{mockTeamMembers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {mockTeamMembers.filter(m => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {mockTeamMembers.filter(m => m.role === 'Admin').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {mockTeamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Team Members</CardTitle>
            <div className="relative w-full sm:w-80">
              <label htmlFor="member-search" className="sr-only">Search team members</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="member-search"
                name="member-search"
                placeholder="Search members..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                aria-label="Search team members"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{member.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2">
                  <div className="flex flex-col sm:text-right gap-2">
                    <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'} className="w-fit">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {member.tasksCompleted} tasks completed
                    </p>
                  </div>
                  
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                    {member.status}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border z-50">
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label htmlFor="invite-email" className="block text-sm font-medium text-foreground">Email Address</label>
            <Input
              id="invite-email"
              name="inviteEmail"
              autoComplete="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              type="email"
              aria-label="Email Address"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" disabled={!inviteEmail} onClick={() => toast('Feature coming soon!')}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};