import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Plus, Users, Pencil, Trash2 } from 'lucide-react';

const supabase = createClientComponentClient();

const TeamsTab = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    { id: 'member', name: 'Team Member' },
    { id: 'lead', name: 'Team Lead' },
    { id: 'approver', name: 'Content Approver' }
  ];

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsTeamsLoading(true);
      setError(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error('Authentication error');
      if (!user) throw new Error('No authenticated user found');

      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          created_at,
          user_teams!inner (
            id,
            user_id,
            role,
            users:auth_user_list!user_id (
              id,
              email,
              raw_user_meta_data
            )
          )
        `);

      if (error) throw error;

      const teamsWithMembers = data.map(team => ({
        ...team,
        members: (team.user_teams || []).map(member => ({
          ...member,
          users: {
            email: member.users.email,
            full_name: member.users.raw_user_meta_data?.full_name || member.users.email
          }
        }))
      }));

      setTeams(teamsWithMembers);
    } catch (error) {
      console.error('Error in fetchTeams:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to load teams: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsTeamsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('auth_user_list')
        .select('*');

      if (error) throw error;

      const formattedUsers = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.raw_user_meta_data?.full_name || user.email,
        created_at: user.created_at
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to load users: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name: newTeamName }])
        .select()
        .single();

      if (error) throw error;

      setTeams([...teams, { ...data, members: [] }]);
      setIsCreateTeamOpen(false);
      setNewTeamName('');
      
      toast({
        title: "Success",
        description: "Team created successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUser = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_teams')
        .insert([{
          team_id: selectedTeam.id,
          user_id: selectedUser,
          role: selectedRole
        }]);

      if (error) throw error;

      await fetchTeams(); // Refresh teams data
      setIsAssignUserOpen(false);
      setSelectedUser('');
      setSelectedRole('');
      
      toast({
        title: "Success",
        description: "User assigned to team successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to assign user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (teamId, userId) => {
    try {
      const { error } = await supabase
        .from('user_teams')
        .delete()
        .match({ team_id: teamId, user_id: userId });

      if (error) throw error;

      await fetchTeams(); // Refresh teams data
      
      toast({
        title: "Success",
        description: "User removed from team successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 border rounded-lg shadow-sm p-4 sm:p-6">
      <div>
        <h3 className="text-lg font-medium">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your teams and assign members to control content approval workflows.
        </p>
      </div>
      
      <Separator />

      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium">Your Teams</h4>
          <p className="text-sm text-muted-foreground">
            Create and manage teams for different departments or projects.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateTeamOpen(true)}
          className="bg-[#fb2e01] hover:bg-[#fb2e01]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map(team => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="text-base">{team.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {team.members.length} members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.members.map(member => (
                  <div 
                    key={member.user_id} 
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {member.users.full_name || member.users.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUser(team.id, member.user_id)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedTeam(team);
                  setIsAssignUserOpen(true);
                }}
              >
                Add Member
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new team to manage content approvals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Name</label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTeamOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim() || isLoading}
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User Dialog */}
      <Dialog open={isAssignUserOpen} onOpenChange={setIsAssignUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select User</label>
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Role</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignUserOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignUser}
              disabled={!selectedUser || !selectedRole || isLoading}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsTab;