#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { Dashboard } from './components/Dashboard.js';
import { loadData, updateExercise, addExercise, removeExercise, formatDate } from './utils/data.js';
import { pushToGithub, initGitRepo, getGitStatus } from './utils/git.js';

const program = new Command();

program
    .name('wout')
    .description('CLI Workout Tracker')
    .version('1.0.0');

// Default command - open dashboard
program
    .command('dashboard', { isDefault: true })
    .description('Open the interactive workout dashboard')
    .action(() => {
        render(React.createElement(Dashboard));
    });

// Add command
program
    .command('add <exercise> <amount>')
    .description('Add exercise progress (e.g., wout add pushups 20)')
    .action((exercise: string, amount: string) => {
        const data = loadData();
        const exerciseLower = exercise.toLowerCase();

        if (!data.exercises[exerciseLower]) {
            console.log(`❌ Exercise "${exercise}" not found.`);
            console.log(`Available exercises: ${Object.keys(data.exercises).join(', ')}`);
            return;
        }

        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) {
            console.log('❌ Amount must be a positive number');
            return;
        }

        const newData = updateExercise(exerciseLower, num, 'add');
        const today = formatDate(new Date());
        const current = newData.logs[today]?.[exerciseLower] || 0;
        const target = newData.exercises[exerciseLower].dailyTarget;
        const unit = newData.exercises[exerciseLower].unit;

        console.log(`✅ Added ${num} ${unit} to ${exerciseLower}`);
        console.log(`   Progress: ${current}/${target} ${unit} (${Math.round((current / target) * 100)}%)`);
    });

// Set command
program
    .command('set <exercise> <amount>')
    .description('Set exact exercise value (e.g., wout set running 5)')
    .action((exercise: string, amount: string) => {
        const data = loadData();
        const exerciseLower = exercise.toLowerCase();

        if (!data.exercises[exerciseLower]) {
            console.log(`❌ Exercise "${exercise}" not found.`);
            console.log(`Available exercises: ${Object.keys(data.exercises).join(', ')}`);
            return;
        }

        const num = parseFloat(amount);
        if (isNaN(num) || num < 0) {
            console.log('❌ Amount must be a non-negative number');
            return;
        }

        const newData = updateExercise(exerciseLower, num, 'set');
        const today = formatDate(new Date());
        const current = newData.logs[today]?.[exerciseLower] || 0;
        const target = newData.exercises[exerciseLower].dailyTarget;
        const unit = newData.exercises[exerciseLower].unit;

        console.log(`✅ Set ${exerciseLower} to ${num} ${unit}`);
        console.log(`   Progress: ${current}/${target} ${unit} (${Math.round((current / target) * 100)}%)`);
    });

// Status command
program
    .command('status')
    .description('Show today\'s workout status')
    .action(() => {
        const data = loadData();
        const today = formatDate(new Date());
        const dayLog = data.logs[today] || {};

        console.log('\n🏋️  Today\'s Workout Status');
        console.log('═'.repeat(40));

        Object.entries(data.exercises).forEach(([name, config]) => {
            const current = dayLog[name] || 0;
            const target = config.dailyTarget;
            const percentage = Math.round((current / target) * 100);
            const completed = current >= target;

            const barWidth = 20;
            const filled = Math.round((Math.min(percentage, 100) / 100) * barWidth);
            const progressBar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

            const icon = completed ? '✓' : '○';
            console.log(`${icon} ${name.padEnd(12)} ${String(current).padStart(4)}/${target} ${config.unit.padEnd(4)} ${progressBar} ${percentage}%`);
        });

        console.log('═'.repeat(40));
    });

// Push command
program
    .command('push')
    .description('Push workout data to GitHub')
    .action(() => {
        console.log('📤 Pushing to GitHub...');
        const result = pushToGithub();

        if (result.success) {
            console.log(`✅ ${result.message}`);
        } else {
            console.log(`❌ ${result.message}`);
        }
    });

// Git init command
program
    .command('git-init')
    .description('Initialize git repository in data directory')
    .action(() => {
        const success = initGitRepo();
        if (success) {
            console.log('✅ Git repository initialized in ~/.workout');
            console.log('\nNext steps:');
            console.log('  1. Create a GitHub repository');
            console.log('  2. cd ~/.workout');
            console.log('  3. git remote add origin <your-repo-url>');
            console.log('  4. git branch -M main');
            console.log('  5. git push -u origin main');
        } else {
            console.log('❌ Failed to initialize git repository');
        }
    });

// Git status command
program
    .command('git-status')
    .description('Show git status of workout data')
    .action(() => {
        console.log('📊 Git Status:');
        console.log(getGitStatus());
    });

// List exercises command
program
    .command('list')
    .description('List all configured exercises')
    .action(() => {
        const data = loadData();

        console.log('\n📋 Configured Exercises');
        console.log('═'.repeat(40));

        Object.entries(data.exercises).forEach(([name, config]) => {
            console.log(`  ${name.padEnd(12)} - ${config.dailyTarget} ${config.unit}/day`);
        });

        console.log('═'.repeat(40));
    });

// Config add exercise
program
    .command('config-add <name> <unit> <dailyTarget>')
    .description('Add a new exercise (e.g., wout config-add squats reps 50)')
    .action((name: string, unit: string, dailyTarget: string) => {
        const target = parseInt(dailyTarget);
        if (isNaN(target) || target <= 0) {
            console.log('❌ Daily target must be a positive number');
            return;
        }

        addExercise(name, unit, target);
        console.log(`✅ Added exercise: ${name} (${target} ${unit}/day)`);
    });

// Config remove exercise
program
    .command('config-remove <name>')
    .description('Remove an exercise')
    .action((name: string) => {
        const data = loadData();
        if (!data.exercises[name.toLowerCase()]) {
            console.log(`❌ Exercise "${name}" not found`);
            return;
        }

        removeExercise(name);
        console.log(`✅ Removed exercise: ${name}`);
    });

program.parse();
