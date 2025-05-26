import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockLeagueData } from '../data/mockData';

// Types
export interface Team {
  id: string;
  name: string;
  logo?: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
}

export interface Category {
  id: string;
  name: string;
  leagueId: string;
  isEditable: boolean;
}

export interface Zone {
  id: string;
  name: string;
  leagueId: string;
  categoryId: string;
}

export interface Match {
  id: string;
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export interface Fixture {
  id: string;
  date: string;
  matchDate: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  matches: Match[];
}

export interface Standing {
  id: string;
  teamId: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface League {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  active: boolean;
}

interface LeagueContextType {
  leagues: League[];
  categories: Category[];
  zones: Zone[];
  teams: Team[];
  fixtures: Fixture[];
  standings: Standing[];
  courses: Course[];
  
  // League operations
  getLeague: (id: string) => League | undefined;
  
  // Category operations
  getCategoriesByLeague: (leagueId: string) => Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Zone operations
  getZonesByCategory: (categoryId: string) => Zone[];
  addZone: (zone: Omit<Zone, 'id'>) => void;
  updateZone: (id: string, data: Partial<Zone>) => void;
  deleteZone: (id: string) => void;
  
  // Team operations
  getTeamsByZone: (zoneId: string) => Team[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  
  // Fixture operations
  getFixturesByZone: (zoneId: string) => Fixture[];
  addFixture: (fixture: Omit<Fixture, 'id'>) => void;
  updateFixture: (id: string, data: Partial<Fixture>) => void;
  deleteFixture: (id: string) => void;
  
  // Match operations
  updateMatchResult: (matchId: string, homeScore: number, awayScore: number) => void;
  
  // Standings operations
  getStandingsByZone: (zoneId: string) => Standing[];
  updateStanding: (id: string, data: Partial<Standing>) => void;

  // Course operations
  getCourses: () => Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
}

// Solo una declaración del contexto
const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

// Solo una declaración de useLeague
export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}

interface LeagueProviderProps {
  children: React.ReactNode;
}

export const LeagueProvider: React.FC<LeagueProviderProps> = ({ children }) => {
  // Initialize state with mock data
  const [leagues, setLeagues] = useState<League[]>(mockLeagueData.leagues);
  const [categories, setCategories] = useState<Category[]>(mockLeagueData.categories);
  const [zones, setZones] = useState<Zone[]>(mockLeagueData.zones);
  const [teams, setTeams] = useState<Team[]>(mockLeagueData.teams);
  const [fixtures, setFixtures] = useState<Fixture[]>(mockLeagueData.fixtures);
  const [standings, setStandings] = useState<Standing[]>(mockLeagueData.standings);
  const [courses, setCourses] = useState<Course[]>([]);

  // League operations
  const getLeague = (id: string) => {
    return leagues.find(league => league.id === id);
  };

  // Category operations
  const getCategoriesByLeague = (leagueId: string) => {
    return categories.filter(category => category.leagueId === leagueId);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: `cat_${Date.now()}`
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, ...data } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Zone operations
  const getZonesByCategory = (categoryId: string) => {
    return zones.filter(zone => zone.categoryId === categoryId);
  };

  const addZone = (zone: Omit<Zone, 'id'>) => {
    const newZone = {
      ...zone,
      id: `zone_${Date.now()}`
    };
    setZones([...zones, newZone]);
  };

  const updateZone = (id: string, data: Partial<Zone>) => {
    setZones(zones.map(zone =>
      zone.id === id ? { ...zone, ...data } : zone
    ));
  };

  const deleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
  };

  // Team operations
  const getTeamsByZone = (zoneId: string) => {
    return teams.filter(team => team.zoneId === zoneId);
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = {
      ...team,
      id: `team_${Date.now()}`
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, data: Partial<Team>) => {
    setTeams(teams.map(team =>
      team.id === id ? { ...team, ...data } : team
    ));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  // Fixture operations
  const getFixturesByZone = (zoneId: string) => {
    return fixtures.filter(fixture => fixture.zoneId === zoneId);
  };

  const addFixture = (fixture: Omit<Fixture, 'id'>) => {
    const newFixture = {
      ...fixture,
      id: `fixture_${Date.now()}`
    };
    setFixtures([...fixtures, newFixture]);
  };

  const updateFixture = (id: string, data: Partial<Fixture>) => {
    setFixtures(fixtures.map(fixture =>
      fixture.id === id ? { ...fixture, ...data } : fixture
    ));
  };

  const deleteFixture = (id: string) => {
    setFixtures(fixtures.filter(fixture => fixture.id !== id));
  };

  // Match operations
  const updateMatchResult = (matchId: string, homeScore: number, awayScore: number) => {
    setFixtures(fixtures.map(fixture => ({
      ...fixture,
      matches: fixture.matches.map(match =>
        match.id === matchId
          ? { ...match, homeScore, awayScore, played: true }
          : match
      )
    })));
  };

  // Standings operations
  const getStandingsByZone = (zoneId: string) => {
    return standings.filter(standing => standing.zoneId === zoneId);
  };

  const updateStanding = (id: string, data: Partial<Standing>) => {
    setStandings(standings.map(standing =>
      standing.id === id ? { ...standing, ...data } : standing
    ));
  };

  // Course operations
  const getCourses = () => {
    return courses;
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = {
      ...course,
      id: `course_${Date.now()}`
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, ...data } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const value: LeagueContextType = {
    leagues,
    categories,
    zones,
    teams,
    fixtures,
    standings,
    courses,
    getLeague,
    getCategoriesByLeague,
    addCategory,
    updateCategory,
    deleteCategory,
    getZonesByCategory,
    addZone,
    updateZone,
    deleteZone,
    getTeamsByZone,
    addTeam,
    updateTeam,
    deleteTeam,
    getFixturesByZone,
    addFixture,
    updateFixture,
    deleteFixture,
    updateMatchResult,
    getStandingsByZone,
    updateStanding,
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse
  };

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
};