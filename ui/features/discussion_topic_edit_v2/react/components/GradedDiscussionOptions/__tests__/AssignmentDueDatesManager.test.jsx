/*
 * Copyright (C) 2023 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {render, fireEvent, screen} from '@testing-library/react'
import React from 'react'
import {AssignmentDueDatesManager} from '../AssignmentDueDatesManager'

const setup = ({} = {}) => {
  return render(<AssignmentDueDatesManager />)
}

describe('AssignmentDueDatesManager', () => {
  it('renders Assignment Settings correctly', () => {
    const {queryByText} = setup()
    expect(queryByText('Assignment Settings')).toBeInTheDocument()
  })

  it('adds a new AssignmentDueDate when Add Assignment is clicked', () => {
    setup()
    const addButton = screen.getByText('Add Assignment')
    fireEvent.click(addButton)
    const assignmentDueDates = screen.getAllByTestId('assignment-due-date')
    expect(assignmentDueDates.length).toBe(2)
  })

  it('shows Close button when there is more than one AssignmentDueDate', () => {
    setup()
    const addButton = screen.getByText('Add Assignment')
    fireEvent.click(addButton)
    // Assuming the CloseButton has a specific label or text
    expect(screen.getAllByText('Close').length).toBe(2)
  })

  it('removes an AssignmentDueDate when Close is clicked', () => {
    setup()
    const addButton = screen.getByText('Add Assignment')
    // Add an assignment
    fireEvent.click(addButton)

    // Verifying that a due date component was created
    let assignmentDueDates = screen.getAllByTestId('assignment-due-date')
    expect(assignmentDueDates.length).toBe(2)

    // Verifying that there is a close button
    let closeButtons = screen.getAllByText('Close')
    fireEvent.click(closeButtons[0])

    // Verifying that the due date was removed
    assignmentDueDates = screen.getAllByTestId('assignment-due-date')
    expect(assignmentDueDates.length).toBe(1)

    // Verify that the close button doesn't exist because there is only 1 dueDate
    closeButtons = screen.queryAllByText('Close')
    expect(closeButtons.length).toBe(0)
  })

  // currently this will use options from the DEFAULT_LIST_OPTIONS, will get replaced in the future.
  it('correctly manages available assignTo options', () => {
    setup()
    const addButton = screen.getByText('Add Assignment')
    // Add an assignment
    fireEvent.click(addButton)

    // There should be 2 menus
    const selectOptions = screen.getAllByTestId('assign-to-select')
    const assignToOptionOne = selectOptions[0]
    const assignToOptionTwo = selectOptions[1]

    fireEvent.click(assignToOptionOne)

    let availableOptions = screen.getAllByTestId('assign-to-select-option')

    // Currently there are 10 DEFAULT_OPTIONS defined in AssignmentDueDatesManager.jsx.
    // All the checks below rely on this.
    // When VICE-3865 is complete, the default data will be replaced with real data that will
    // Need to be mocked. and the data below will need to be updated

    // Select an option
    expect(availableOptions.length).toBe(10)
    fireEvent.click(availableOptions[1])

    // Verify that all options still appear in the menu where the item was selected
    fireEvent.click(assignToOptionOne)
    availableOptions = screen.getAllByTestId('assign-to-select-option')
    expect(availableOptions.length).toBe(10)

    // open second menu, and verify that the selected option is not available
    fireEvent.click(assignToOptionTwo)
    availableOptions = screen.getAllByTestId('assign-to-select-option')
    expect(availableOptions.length).toBe(9)
  })
})
