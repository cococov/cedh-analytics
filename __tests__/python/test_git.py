"""
cEDH Analytics - A website that analyzes and cross-references several
EDH (Magic: The Gathering format) community's resources to give insights
on the competitive metagame.
Copyright (C) 2025-present CoCoCov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Original Repo: https://github.com/cococov/cedh-analytics
https://www.cedh-analytics.com/
"""

import unittest
from unittest.mock import patch, MagicMock, call
import sys
import os

# Add the project root to the Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Import the git module
from scripts.utils import git

class TestGitModule(unittest.TestCase):
    """Test cases for the git utility module."""

    @patch('subprocess.check_call')
    def test_add_all(self, mock_check_call):
        """Test the add_all function."""
        git.add_all()
        mock_check_call.assert_called_once_with(['git', 'add', '.'],
                                              stdout=git.DEVNULL,
                                              stderr=git.STDOUT,
                                              env=git.ENV)

    @patch('subprocess.check_output')
    @patch('subprocess.check_call')
    @patch('subprocess.Popen')
    @patch('scripts.utils.logs.warning_log')
    @patch('scripts.utils.logs.info_log')
    def test_commit_with_changes(self, mock_info_log, mock_warning_log, mock_popen,
                               mock_check_call, mock_check_output):
        """Test the commit function with changes to commit."""
        # Mock subprocess.check_output to return some changes
        mock_check_output.return_value = b'M file.txt'

        # Mock Popen process with successful return code
        process_mock = MagicMock()
        process_mock.returncode = 0
        process_mock.communicate.return_value = (b'', b'')
        mock_popen.return_value = process_mock

        # Call the commit function
        git.commit('Test commit message')

        # Verify the correct calls were made
        mock_check_output.assert_called_once_with(['git', 'status', '--porcelain'], env=git.ENV)
        mock_popen.assert_called_once_with(['git', 'commit', '-m', 'Test commit message'],
                                         stdout=git.subprocess.PIPE,
                                         stderr=git.subprocess.PIPE,
                                         env=git.ENV)
        process_mock.communicate.assert_called_once()
        mock_check_call.assert_not_called()  # Should not call check_call with --allow-empty

    @patch('subprocess.check_output')
    @patch('scripts.utils.logs.warning_log')
    def test_commit_no_changes(self, mock_warning_log, mock_check_output):
        """Test the commit function with no changes to commit."""
        # Mock subprocess.check_output to return empty (no changes)
        mock_check_output.return_value = b''

        # Call the commit function
        git.commit('Test commit message')

        # Verify the warning log was called
        mock_warning_log.assert_called_once_with("No changes to commit. Skipping commit operation.")

    @patch('subprocess.check_output')
    @patch('subprocess.Popen')
    @patch('subprocess.check_call')
    @patch('scripts.utils.logs.warning_log')
    @patch('scripts.utils.logs.info_log')
    def test_commit_with_error(self, mock_info_log, mock_warning_log, mock_check_call,
                             mock_popen, mock_check_output):
        """Test the commit function with an error during commit."""
        # Mock subprocess.check_output to return some changes
        mock_check_output.return_value = b'M file.txt'

        # Mock Popen process with error return code
        process_mock = MagicMock()
        process_mock.returncode = 1
        process_mock.communicate.return_value = (b'', b'Error message')
        mock_popen.return_value = process_mock

        # Call the commit function
        git.commit('Test commit message')

        # Verify the correct calls were made
        mock_warning_log.assert_called_once_with("Git commit initial attempt failed: Error message")
        mock_info_log.assert_called_once_with("Attempting commit with --allow-empty flag")
        mock_check_call.assert_called_once_with(['git', 'commit', '--allow-empty', '-m', 'Test commit message'],
                                              env=git.ENV)

    @patch('subprocess.check_call')
    def test_push(self, mock_check_call):
        """Test the push function."""
        git.push()
        mock_check_call.assert_called_once_with(['git', 'push'],
                                              stdout=git.DEVNULL,
                                              stderr=git.STDOUT,
                                              env=git.ENV)

    @patch('subprocess.check_call')
    def test_push_set_upstream(self, mock_check_call):
        """Test the push_set_upstream function."""
        git.push_set_upstream('feature-branch')
        mock_check_call.assert_called_once_with(['git', 'push', '--set-upstream', 'origin', 'feature-branch'],
                                              stdout=git.DEVNULL,
                                              stderr=git.STDOUT,
                                              env=git.ENV)

    @patch('scripts.utils.git.add_all')
    @patch('scripts.utils.git.commit')
    @patch('scripts.utils.git.push')
    @patch('time.sleep')
    @patch('scripts.utils.logs.begin_log_block')
    @patch('scripts.utils.logs.success_log')
    def test_update(self, mock_success_log, mock_begin_log_block, mock_sleep,
                  mock_push, mock_commit, mock_add_all):
        """Test the update function."""
        git.update('Update message')

        mock_begin_log_block.assert_called_once_with('Uploading changes')
        mock_add_all.assert_called_once()
        mock_commit.assert_called_once_with('Update message')
        mock_push.assert_called_once()
        mock_sleep.assert_called_once_with(1)
        mock_success_log.assert_called_once_with('Updated!')

    @patch('scripts.utils.git.add_all')
    @patch('scripts.utils.git.commit')
    @patch('time.sleep')
    @patch('scripts.utils.logs.begin_log_block')
    @patch('scripts.utils.logs.success_log')
    def test_add_and_commit_tournament(self, mock_success_log, mock_begin_log_block,
                                     mock_sleep, mock_commit, mock_add_all):
        """Test the add_and_commit_tournament function."""
        git.add_and_commit_tournament('Tournament XYZ')

        mock_begin_log_block.assert_called_once_with('Commit changes')
        mock_add_all.assert_called_once()
        mock_commit.assert_called_once_with('chore: update tournament Tournament XYZ')
        mock_sleep.assert_called_once_with(1)
        mock_success_log.assert_called_once_with('Tournament XYZ updated!')

if __name__ == '__main__':
    unittest.main()
