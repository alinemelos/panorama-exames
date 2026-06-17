from .exam import ExamListCreateView, ExamDetailView
from .machine import MachineListCreateView, MachineDetailView
from .problem import ProblemListCreateView, ProblemDetailView
from .duty import DutyCreateView, DutyCurrentView, DutyAddCollectionView, DutyCloseView
from .dashboard import DashboardView

__all__ = [
    'ExamListCreateView',
    'ExamDetailView',
    'MachineListCreateView',
    'MachineDetailView',
    'ProblemListCreateView',
    'ProblemDetailView',
    'DutyCreateView',
    'DutyCurrentView',
    'DutyAddCollectionView',
    'DutyCloseView',
    'DashboardView',
]
