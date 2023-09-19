import React from "react"
import type { FacetController } from "../facets/controller"
import type { BaseFacetConfig, BaseFacetState, FacetFilter } from "../common/types/search/facets"

export const FacetControllersContext =  React.createContext<FacetControllers>(new Map())

export type FacetControllers = Map<string, FacetController<BaseFacetConfig, BaseFacetState, FacetFilter>>