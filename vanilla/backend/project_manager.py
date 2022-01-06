import os



class ProjectManager():
    def __init__(self, project_path):
        self.project_path = project_path
        self.selected_project = None
    
    def set_project(self, project):
        self.selected_project = project
    