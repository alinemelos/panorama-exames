from .exam import ExamListCreateView, ExamDetailView
from .machine import MachineListCreateView, MachineDetailView
from .problem import ProblemListView
from .duty import DutyCreateView, DutyCurrentView, DutyAddCollectionView, DutyCloseView
from .dashboard import DashboardView

__all__ = [
    'ExamListCreateView',
    'ExamDetailView',
    'MachineListCreateView',
    'MachineDetailView',
    'ProblemListView',
    'DutyCreateView',
    'DutyCurrentView',
    'DutyAddCollectionView',
    'DutyCloseView',
    'DashboardView',
]
