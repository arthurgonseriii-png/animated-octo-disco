# BQC-Nav Feature Roadmap

This document outlines the planned features for the BQC-Nav application, based on the vision for a comprehensive, AI-powered tool for I&C technicians.

## Phase 1: Core Automation and Field Assistance

### 1. Work Package Automation
*   **Purpose:** To eliminate manual data entry and task creation by automatically processing work packages.
*   **Implementation:**
    *   **Work List Parsing:** Create a new page where a user can paste or upload a list of work items (e.g., cables to be located, transmitters to be calibrated). The application will use natural language processing (NLP) to parse this list and identify individual tasks, equipment, and locations.
    *   **Automated Task Generation:** For each parsed item, the application will automatically create a new task in the Task Management module, pre-populated with the relevant information.
    *   **Task Prioritization:** The system will intelligently prioritize tasks based on the order in the work list and any other available data.

### 2. AI-Powered Field Assistance
*   **Purpose:** To provide real-time, AI-driven guidance to technicians in the field, reducing the need for manual lookups and guesswork.
*   **Implementation:**
    *   **Enhanced Lidar/Photo Analysis:**
        *   **Material Identification:** When analyzing a photo or Lidar scan, the AI will identify not just the equipment but also the necessary materials for a given task (e.g., "3/4 inch conduit," "2-hole lugs," "4-inch LB").
        *   **Route Planning:** For cable-pulling tasks, the AI will analyze Lidar data to suggest the optimal route, calculate conduit/cable lengths, and identify any missing components (e.g., "missing 90-degree elbow").
    *   **Intelligent Tool & Material Lists:**
        *   Based on the task and the AI's analysis, the application will generate a list of required tools, materials, and PPE.
        *   If the application has previous data on the equipment, it will pre-populate the list with known requirements.

### 3. Automated JSA (Job Safety Analysis) Generation
*   **Purpose:** To streamline the creation of daily JSAs by auto-populating them with relevant information.
*   **Implementation:**
    *   The user will select the tasks for their shift from the generated task list.
    *   The application will then automatically generate a JSA, filling in the location, equipment, and known hazards based on the selected tasks and any available data.
    *   The user will then only need to review and sign the JSA, saving significant time.

## Phase 2: Advanced Reporting and Integration

### 4. Automated End-of-Shift Reporting
*   **Purpose:** To automatically generate a comprehensive end-of-shift report, summarizing the technician's work and eliminating manual report writing.
*   **Implementation:**
    *   The application will compile all of the day's activities, including completed tasks, photos taken, notes entered (both free-hand and typed), and any materials used.
    *   This data will be formatted into a professional, exportable report that can be easily shared with supervisors.

### 5. Enhanced Plant Mapping/Location Tool
*   **Purpose:** To create a "living blueprint" of the plant that becomes more accurate over time, making it easier to locate equipment and cables.
*   **Implementation:**
    *   Every time a technician takes a photo or Lidar scan, the application will use the geospatial data to refine the location of the equipment in the database.
    *   Over time, this will create a highly accurate, crowd-sourced map of the plant's assets.

## Phase 3: Administrative and User Management

### 6. Custom Task Template Generation
*   **Purpose:** To allow administrators to create new, custom task templates without needing to modify the application's code.
*   **Implementation:**
    *   An admin console will be created where an administrator can define a new task type, including its name, description, required checklist items, and any required files or photos.

### 7. Change Request Inbox
*   **Purpose:** To provide a formal system for users to request changes to their profiles (e.g., new phone number, updated address) and for administrators to approve or deny these requests.
*   **Implementation:**
    *   A new "Change Requests" section will be added to the admin console where administrators can view and manage all pending change requests.
