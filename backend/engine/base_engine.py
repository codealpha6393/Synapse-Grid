from abc import ABC, abstractmethod

from models.result import SimulationResult
from models.scenario import ScenarioInput


class BaseEngine(ABC):
    @abstractmethod
    def simulate(self, scenario: ScenarioInput) -> SimulationResult:
        raise NotImplementedError
