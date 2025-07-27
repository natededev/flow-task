import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';

export const Reports = () => {
  const teamPerformanceData = [
    { name: 'John Doe', tasks: 24, efficiency: 92 },
    { name: 'Jane Smith', tasks: 18, efficiency: 89 },
    { name: 'Mike Johnson', tasks: 12, efficiency: 76 },
  ];
  
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your team's productivity and project progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Tasks</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Completed</CardTitle>
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">103</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +8% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">32</div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <TrendingDown className="h-4 w-4" />
              -3% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Overdue</CardTitle>
              <Clock className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">21</div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <TrendingUp className="h-4 w-4" />
              +2% from last week
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                const completed = Math.floor(Math.random() * 20) + 5;
                const pending = Math.floor(Math.random() * 10) + 2;
                const total = completed + pending;
                const percentage = Math.round((completed / total) * 100);
                
                return (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-sm">{day}</div>
                      <div className="flex-1 bg-muted rounded-full h-2 w-32">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {completed}/{total} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">35%</div>
                  <Badge variant="secondary">12 projects</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-orange-600">45%</div>
                  <Badge variant="secondary">15 projects</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-red-600">20%</div>
                  <Badge variant="secondary">7 projects</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformanceData.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.tasks} tasks completed</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{member.efficiency}%</div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                  </div>
                  <Badge variant={member.efficiency > 85 ? 'default' : member.efficiency > 70 ? 'secondary' : 'destructive'}>
                    {member.efficiency > 85 ? 'Excellent' : member.efficiency > 70 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};